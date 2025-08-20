const { Router } = require('express');
const { z } = require('zod');
const { auth } = require('../middleware/auth');
const { sequelize } = require('../sequelize');
const { DataTypes, Op } = require('sequelize');

// Lightweight models
const Measurement = sequelize.define('Measurement', {
  id: { type: DataTypes.STRING, primaryKey: true },
  patientId: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  weight: { type: DataTypes.FLOAT, allowNull: true },
  waist: { type: DataTypes.FLOAT, allowNull: true },
  hip: { type: DataTypes.FLOAT, allowNull: true },
  bodyFat: { type: DataTypes.FLOAT, allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'Measurement', timestamps: true, createdAt: 'createdAt', updatedAt: false });

const Patient = sequelize.define('Patient', {
  id: { type: DataTypes.STRING, primaryKey: true },
  nutritionistId: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'Patient' });

const router = Router();

// Schemas
const baseFields = {
  patientId: z.string().min(1),
  date: z.coerce.date(),
  weight: z.coerce.number().positive().max(1000).optional().nullable(),
  waist: z.coerce.number().positive().max(500).optional().nullable(),
  hip: z.coerce.number().positive().max(500).optional().nullable(),
  bodyFat: z.coerce.number().min(0).max(100).optional().nullable(),
  notes: z.string().max(10000).optional().nullable(),
};

const createSchema = z.object(baseFields);
const updateSchema = z.object({
  date: baseFields.date.optional(),
  weight: baseFields.weight,
  waist: baseFields.waist,
  hip: baseFields.hip,
  bodyFat: baseFields.bodyFat,
  notes: baseFields.notes,
});

function ok(res, data, message) {
  return res.json({ status: 'success', data, message: message || undefined });
}

function created(res, data, message) {
  return res.status(201).json({ status: 'success', data, message: message || undefined });
}

function fail(res, code, message) {
  return res.status(code).json({ status: 'error', message });
}

// Create measurement
router.post('/measurements', auth(true), async (req, res) => {
  try {
    const payload = createSchema.parse(req.body);

    // ownership check
    const patient = await Patient.findOne({ where: { id: payload.patientId, nutritionistId: req.user.id } });
    if (!patient) return fail(res, 404, 'Paciente não encontrado');

    const createdItem = await Measurement.create({
      patientId: payload.patientId,
      date: payload.date,
      weight: payload.weight ?? null,
      waist: payload.waist ?? null,
      hip: payload.hip ?? null,
      bodyFat: payload.bodyFat ?? null,
      notes: payload.notes ?? null,
    });
    return created(res, { measurement: createdItem });
  } catch (err) {
    if (err instanceof z.ZodError) return fail(res, 400, 'Dados inválidos');
    return fail(res, 500, 'Erro ao criar medição');
  }
});

// Get measurement by id
router.get('/measurements/:id', auth(true), async (req, res) => {
  try {
    const id = req.params.id;
    const m = await Measurement.findByPk(id);
    if (!m) return fail(res, 404, 'Medição não encontrada');
    // ownership check: patient belongs to nutritionist
    const patient = await Patient.findOne({ where: { id: m.patientId, nutritionistId: req.user.id } });
    if (!patient) return fail(res, 404, 'Medição não encontrada');
    return ok(res, { measurement: m });
  } catch (_err) {
    return fail(res, 500, 'Erro ao carregar medição');
  }
});

// List measurements by patient
router.get('/patients/:patientId/measurements', auth(true), async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const patient = await Patient.findOne({ where: { id: patientId, nutritionistId: req.user.id } });
    if (!patient) return fail(res, 404, 'Paciente não encontrado');

    const items = await Measurement.findAll({
      where: { patientId },
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
    });
    return ok(res, { data: items });
  } catch (_err) {
    return fail(res, 500, 'Erro ao listar medições');
  }
});

// Update measurement
router.put('/measurements/:id', auth(true), async (req, res) => {
  try {
    const id = req.params.id;
    const payload = updateSchema.parse(req.body);

    const m = await Measurement.findByPk(id);
    if (!m) return fail(res, 404, 'Medição não encontrada');
    const patient = await Patient.findOne({ where: { id: m.patientId, nutritionistId: req.user.id } });
    if (!patient) return fail(res, 404, 'Medição não encontrada');

    await m.update({
      ...(payload.date !== undefined ? { date: payload.date } : {}),
      weight: payload.weight ?? m.weight,
      waist: payload.waist ?? m.waist,
      hip: payload.hip ?? m.hip,
      bodyFat: payload.bodyFat ?? m.bodyFat,
      notes: payload.notes !== undefined ? (payload.notes ?? null) : m.notes,
    });
    return ok(res, { measurement: m });
  } catch (err) {
    if (err instanceof z.ZodError) return fail(res, 400, 'Dados inválidos');
    return fail(res, 500, 'Erro ao atualizar medição');
  }
});

// Delete measurement
router.delete('/measurements/:id', auth(true), async (req, res) => {
  try {
    const id = req.params.id;
    const m = await Measurement.findByPk(id);
    if (!m) return fail(res, 404, 'Medição não encontrada');
    const patient = await Patient.findOne({ where: { id: m.patientId, nutritionistId: req.user.id } });
    if (!patient) return fail(res, 404, 'Medição não encontrada');

    await m.destroy();
    return res.status(204).json();
  } catch (_err) {
    return fail(res, 500, 'Erro ao excluir medição');
  }
});

module.exports = router;


