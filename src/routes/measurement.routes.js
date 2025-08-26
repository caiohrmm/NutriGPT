const { Router } = require('express');
const { z } = require('zod');
const { auth } = require('../middleware/auth');
const { sequelize } = require('../sequelize');
const { DataTypes, Op } = require('sequelize');

// Lightweight models
const Measurement = sequelize.define('Measurement', {
  id: { type: DataTypes.STRING, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  patientId: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  weight: { type: DataTypes.FLOAT, allowNull: true },
  heightCm: { type: DataTypes.FLOAT, allowNull: true },
  bmi: { type: DataTypes.FLOAT, allowNull: true },
  bodyFatPercentage: { type: DataTypes.FLOAT, allowNull: true },
  waistCircumference: { type: DataTypes.FLOAT, allowNull: true },
  hipCircumference: { type: DataTypes.FLOAT, allowNull: true },
  armCircumference: { type: DataTypes.FLOAT, allowNull: true },
  // legacy fields (kept for compatibility)
  waist: { type: DataTypes.FLOAT, allowNull: true },
  hip: { type: DataTypes.FLOAT, allowNull: true },
  bodyFat: { type: DataTypes.FLOAT, allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'Measurement', timestamps: true });

const Patient = sequelize.define('Patient', {
  id: { type: DataTypes.STRING, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  nutritionistId: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'Patient' });

const router = Router();

// Schemas (v1)
const createSchema = z.object({
  patientId: z.string().min(1),
  date: z.string().datetime().optional(),
  weight: z.coerce.number().positive().max(500).optional(),
  heightCm: z.coerce.number().positive().max(300).optional(),
  bmi: z.coerce.number().positive().max(100).optional(),
  bodyFatPercentage: z.coerce.number().min(1).max(75).optional(),
  waistCircumference: z.coerce.number().positive().max(300).optional(),
  hipCircumference: z.coerce.number().positive().max(300).optional(),
  armCircumference: z.coerce.number().positive().max(100).optional(),
  notes: z.string().max(5000).optional(),
});

const updateSchema = z.object({
  date: z.string().datetime().optional(),
  weight: z.coerce.number().positive().max(500).optional(),
  heightCm: z.coerce.number().positive().max(300).optional(),
  bmi: z.coerce.number().positive().max(100).optional(),
  bodyFatPercentage: z.coerce.number().min(1).max(75).optional(),
  waistCircumference: z.coerce.number().positive().max(300).optional(),
  hipCircumference: z.coerce.number().positive().max(300).optional(),
  armCircumference: z.coerce.number().positive().max(100).optional(),
  notes: z.string().max(5000).optional(),
});

function ok(res, data, message) {
  return res.json({ status: 'success', data, message: message || undefined });
}

function created(res, data, message) {
  return res.status(201).json({ status: 'success', data, message: message || undefined });
}

function fail(res, code, message, error) {
  return res.status(code).json({ status: 'error', message, error });
}

function computeBmi(weight, heightCm) {
  const w = Number(weight);
  const h = Number(heightCm);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return null;
  const hMeters = h / 100;
  const bmi = w / (hMeters * hMeters);
  return Math.round(bmi * 100) / 100; // 2 casas
}

// Create measurement
router.post('/measurements', auth(true), async (req, res) => {
  try {
    const payload = createSchema.parse(req.body);

    // ownership check
    const patient = await Patient.findOne({ where: { id: payload.patientId, nutritionistId: req.user.id } });
    if (!patient) return fail(res, 404, 'Paciente não encontrado');

    // default date now if missing
    const dateValue = payload.date ? new Date(payload.date) : new Date();

    // calculate BMI if applicable
    let bmiValue = payload.bmi;
    if ((payload.weight && payload.heightCm) && (payload.bmi === undefined)) {
      bmiValue = computeBmi(payload.weight, payload.heightCm);
    }

    const createdItem = await Measurement.create({
      patientId: payload.patientId,
      date: dateValue,
      weight: payload.weight ?? null,
      heightCm: payload.heightCm ?? null,
      bmi: bmiValue ?? null,
      bodyFatPercentage: payload.bodyFatPercentage ?? null,
      waistCircumference: payload.waistCircumference ?? null,
      hipCircumference: payload.hipCircumference ?? null,
      armCircumference: payload.armCircumference ?? null,
      notes: payload.notes ?? null,
    });
    return created(res, { measurement: createdItem });
  } catch (err) {
    if (err instanceof z.ZodError) return fail(res, 400, 'Dados inválidos', { details: err.issues });
    if (err && err.name === 'SequelizeUniqueConstraintError') {
      return fail(res, 409, 'Medição já existe para este paciente nesta data');
    }
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
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize, 10) || 20));
    const from = req.query.from ? new Date(req.query.from) : null;
    const to = req.query.to ? new Date(req.query.to) : null;
    const sort = (req.query.sort || 'date:desc').toString();
    const direction = sort.endsWith(':asc') ? 'ASC' : 'DESC';

    const where = { patientId };
    if (from || to) {
      where.date = {};
      if (from && !Number.isNaN(from.getTime())) where.date[Op.gte] = from;
      if (to && !Number.isNaN(to.getTime())) where.date[Op.lte] = to;
    }

    const { rows, count } = await Measurement.findAndCountAll({
      where,
      order: [['date', direction], ['createdAt', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });
    return ok(res, { data: rows, meta: { total: count, page, pageSize, totalPages: Math.ceil(count / pageSize) } });
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

    // If weight/heightCm changed and bmi not provided, recompute
    let updates = { };
    if (payload.date !== undefined) updates.date = new Date(payload.date);
    if (payload.weight !== undefined) updates.weight = payload.weight;
    if (payload.heightCm !== undefined) updates.heightCm = payload.heightCm;
    if (payload.bodyFatPercentage !== undefined) updates.bodyFatPercentage = payload.bodyFatPercentage;
    if (payload.waistCircumference !== undefined) updates.waistCircumference = payload.waistCircumference;
    if (payload.hipCircumference !== undefined) updates.hipCircumference = payload.hipCircumference;
    if (payload.armCircumference !== undefined) updates.armCircumference = payload.armCircumference;
    if (payload.notes !== undefined) updates.notes = payload.notes ?? null;

    if (payload.bmi !== undefined) {
      updates.bmi = payload.bmi;
    } else {
      const w = (updates.weight !== undefined ? updates.weight : m.weight);
      const h = (updates.heightCm !== undefined ? updates.heightCm : m.heightCm);
      if (w && h) updates.bmi = computeBmi(w, h);
    }

    await m.update(updates);
    return ok(res, { measurement: m });
  } catch (err) {
    if (err instanceof z.ZodError) return fail(res, 400, 'Dados inválidos', { details: err.issues });
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


