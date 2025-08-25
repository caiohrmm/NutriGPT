const { Router } = require('express');
const { z } = require('zod');
const { auth } = require('../middleware/auth');
const { sequelize } = require('../sequelize');
const { DataTypes, Op } = require('sequelize');
const { logger } = require('../utils/logger');

// Lightweight model to avoid import cycles
const Patient = sequelize.define('Patient', {
  id: { type: DataTypes.STRING, primaryKey: true },
  nutritionistId: { type: DataTypes.STRING, allowNull: false },
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: true, unique: true },
  phone: { type: DataTypes.STRING, allowNull: true },
  birthDate: { type: DataTypes.DATE, allowNull: true },
  sex: { type: DataTypes.STRING, allowNull: true },
  weight: { type: DataTypes.FLOAT, allowNull: true },
  height: { type: DataTypes.FLOAT, allowNull: true },
  goal: { type: DataTypes.STRING, allowNull: true },
  allergies: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  notes: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'Patient' });

const router = Router();

const createPatientSchema = z.object({
  fullName: z.string({ required_error: 'fullName é obrigatório' }).min(2, 'fullName deve ter ao menos 2 caracteres'),
  email: z.string().email('email inválido').optional().nullable(),
  weight: z.coerce.number().positive('weight deve ser > 0').max(1000, 'weight muito alto').optional(),
  height: z.coerce.number().positive('height deve ser > 0').max(300, 'height muito alto').optional(),
  goal: z.string().max(255, 'goal muito longo').optional(),
});

const updatePatientSchema = createPatientSchema.partial();

router.post('/patients', auth(true), async (req, res) => {
  try {
    const payload = createPatientSchema.parse(req.body);
    if (payload.email) {
      const exists = await Patient.findOne({ where: { email: payload.email } });
      if (exists) return res.status(409).json({ message: 'Email de paciente já está em uso' });
    }
    const created = await Patient.create({
      nutritionistId: req.user.id,
      fullName: payload.fullName,
      email: payload.email ?? null,
      weight: payload.weight ?? null,
      height: payload.height ?? null,
      goal: payload.goal ?? null,
    });
    return res.status(201).json({ patient: created });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const details = err.issues.map((i) => ({ field: i.path.join('.'), message: i.message, code: i.code }));
      return res.status(400).json({ message: 'Dados inválidos', details });
    }
    if (err && err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Violação de unicidade', details: err.errors?.map((e) => ({ field: e.path, message: e.message })) || [] });
    }
    logger?.error({ err }, 'patients.create.error');
    return res.status(500).json({ message: 'Erro ao cadastrar paciente' });
  }
});

router.get('/patients', auth(true), async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const pageSizeRaw = parseInt(req.query.limit, 10) || 20;
    const pageSize = Math.min(100, Math.max(1, pageSizeRaw));
    const name = (req.query.name || '').trim();
    const goal = (req.query.goal || '').trim();

    const where = {
      nutritionistId: req.user.id,
      ...(name ? { fullName: { [Op.like]: `%${name}%` } } : {}),
      ...(goal ? { goal: { [Op.like]: `%${goal}%` } } : {}),
    };

    const { rows, count } = await Patient.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    return res.json({
      data: rows,
      meta: {
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize),
      },
    });
  } catch (_err) {
    return res.status(500).json({ message: 'Erro ao listar pacientes' });
  }
});

router.put('/patients/:id', auth(true), async (req, res) => {
  try {
    const id = req.params.id;
    const payload = updatePatientSchema.parse(req.body);

    const patient = await Patient.findOne({ where: { id, nutritionistId: req.user.id } });
    if (!patient) return res.status(404).json({ message: 'Paciente não encontrado' });

    if (payload.email && payload.email !== patient.email) {
      const exists = await Patient.findOne({ where: { email: payload.email } });
      if (exists) return res.status(409).json({ message: 'Email de paciente já está em uso' });
    }

    await patient.update(payload);
    return res.json({ patient });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const details = err.issues.map((i) => ({ field: i.path.join('.'), message: i.message, code: i.code }));
      return res.status(400).json({ message: 'Dados inválidos', details });
    }
    if (err && err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Violação de unicidade', details: err.errors?.map((e) => ({ field: e.path, message: e.message })) || [] });
    }
    logger?.error({ err }, 'patients.update.error');
    return res.status(500).json({ message: 'Erro ao atualizar paciente' });
  }
});

router.delete('/patients/:id', auth(true), async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Patient.destroy({ where: { id, nutritionistId: req.user.id } });
    if (!deleted) return res.status(404).json({ message: 'Paciente não encontrado' });
    return res.status(204).send();
  } catch (_err) {
    return res.status(500).json({ message: 'Erro ao excluir paciente' });
  }
});

module.exports = router;


