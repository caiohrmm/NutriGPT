const { Router } = require('express');
const { z } = require('zod');
const { auth } = require('../middleware/auth');
const { sequelize } = require('../sequelize');
const { DataTypes, Op } = require('sequelize');

// Lightweight models to avoid cyclic imports
const Appointment = sequelize.define('Appointment', {
  id: { type: DataTypes.STRING, primaryKey: true },
  nutritionistId: { type: DataTypes.STRING, allowNull: false },
  patientId: { type: DataTypes.STRING, allowNull: false },
  startAt: { type: DataTypes.DATE, allowNull: false },
  endAt: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'scheduled' },
  notes: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'Appointment' });

const Patient = sequelize.define('Patient', {
  id: { type: DataTypes.STRING, primaryKey: true },
  nutritionistId: { type: DataTypes.STRING, allowNull: false },
  fullName: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'Patient' });

const router = Router();

const allowedStatuses = ['scheduled', 'done', 'canceled'];

const createSchema = z.object({
  patientId: z.string().min(1),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  notes: z.string().max(5000).optional().nullable(),
});

const updateSchema = z.object({
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
  notes: z.string().max(5000).optional().nullable(),
  status: z.enum(['scheduled', 'done', 'canceled']).optional(),
}).refine((data) => {
  if ((data.startAt && !data.endAt) || (!data.startAt && data.endAt)) return false;
  return true;
}, { message: 'Para remarcar, envie startAt e endAt juntos' });

function getRange(date, kind) {
  const base = new Date(date);
  if (Number.isNaN(base.getTime())) return null;

  if (kind === 'day') {
    const start = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate(), 0, 0, 0));
    const end = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate() + 1, 0, 0, 0));
    return { start, end };
  }

  if (kind === 'week') {
    // Week starts Monday (ISO). Compute day of week (0=Sun..6=Sat)
    const dow = base.getUTCDay();
    const diffToMonday = (dow === 0 ? -6 : 1 - dow);
    const monday = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate() + diffToMonday, 0, 0, 0));
    const nextMonday = new Date(Date.UTC(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate() + 7, 0, 0, 0));
    return { start: monday, end: nextMonday };
  }

  if (kind === 'month') {
    const start = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), 1, 0, 0, 0));
    const end = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + 1, 1, 0, 0, 0));
    return { start, end };
  }

  return null;
}

// Create appointment (vinculada a um paciente)
router.post('/appointments', auth(true), async (req, res) => {
  try {
    const payload = createSchema.parse(req.body);

    if (payload.startAt >= payload.endAt) {
      return res.status(400).json({ message: 'Horário inválido: startAt deve ser anterior a endAt' });
    }

    // Ownership check: patient belongs to current nutritionist
    const patient = await Patient.findOne({ where: { id: payload.patientId, nutritionistId: req.user.id } });
    if (!patient) return res.status(404).json({ message: 'Paciente não encontrado' });

    const created = await Appointment.create({
      nutritionistId: req.user.id,
      patientId: payload.patientId,
      startAt: payload.startAt,
      endAt: payload.endAt,
      status: 'scheduled',
      notes: payload.notes ?? null,
    });

    return res.status(201).json({ appointment: created });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ message: 'Dados inválidos', issues: err.issues });
    return res.status(500).json({ message: 'Erro ao criar consulta' });
  }
});

// List appointments by day/week/month
router.get('/appointments', auth(true), async (req, res) => {
  try {
    const rangeKind = (req.query.range || 'day').toString();
    if (!['day', 'week', 'month'].includes(rangeKind)) {
      return res.status(400).json({ message: 'Parâmetro range inválido (use day|week|month)' });
    }

    const dateParam = req.query.date ? new Date(req.query.date) : new Date();
    const range = getRange(dateParam, rangeKind);
    if (!range) return res.status(400).json({ message: 'Data inválida' });

    const where = {
      nutritionistId: req.user.id,
      [Op.and]: [
        // overlap between [startAt, endAt) and [range.start, range.end)
        { startAt: { [Op.lt]: range.end } },
        { endAt: { [Op.gt]: range.start } },
      ],
      ...(req.query.patientId ? { patientId: req.query.patientId } : {}),
      ...(req.query.status && allowedStatuses.includes(req.query.status) ? { status: req.query.status } : {}),
    };

    const items = await Appointment.findAll({
      where,
      order: [['startAt', 'ASC']],
    });

    return res.json({ data: items, range });
  } catch (_err) {
    return res.status(500).json({ message: 'Erro ao listar consultas' });
  }
});

// Update/reschedule appointment
router.put('/appointments/:id', auth(true), async (req, res) => {
  try {
    const id = req.params.id;
    const payload = updateSchema.parse(req.body);

    const appointment = await Appointment.findOne({ where: { id, nutritionistId: req.user.id } });
    if (!appointment) return res.status(404).json({ message: 'Consulta não encontrada' });

    if (payload.startAt && payload.endAt && payload.startAt >= payload.endAt) {
      return res.status(400).json({ message: 'Horário inválido: startAt deve ser anterior a endAt' });
    }

    // Optional: avoid changing patient/nutritionist here
    const updates = {};
    if (payload.startAt && payload.endAt) {
      updates.startAt = payload.startAt;
      updates.endAt = payload.endAt;
    }
    if (payload.notes !== undefined) updates.notes = payload.notes ?? null;
    if (payload.status) updates.status = payload.status;

    await appointment.update(updates);
    return res.json({ appointment });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ message: 'Dados inválidos', issues: err.issues });
    return res.status(500).json({ message: 'Erro ao atualizar consulta' });
  }
});

// Cancel appointment
router.post('/appointments/:id/cancel', auth(true), async (req, res) => {
  try {
    const id = req.params.id;
    const appointment = await Appointment.findOne({ where: { id, nutritionistId: req.user.id } });
    if (!appointment) return res.status(404).json({ message: 'Consulta não encontrada' });

    await appointment.update({ status: 'canceled' });
    return res.json({ appointment });
  } catch (_err) {
    return res.status(500).json({ message: 'Erro ao cancelar consulta' });
  }
});

module.exports = router;


