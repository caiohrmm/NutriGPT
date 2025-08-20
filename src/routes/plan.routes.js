const { Router } = require('express');
const { z } = require('zod');
const { auth } = require('../middleware/auth');
const { sequelize } = require('../sequelize');
const { DataTypes } = require('sequelize');
const { generatePlanSuggestion } = require('../utils/ai');

// Lightweight models
const Plan = sequelize.define('Plan', {
  id: { type: DataTypes.STRING, primaryKey: true },
  patientId: { type: DataTypes.STRING, allowNull: false },
  appointmentId: { type: DataTypes.STRING, allowNull: true },
  nutritionistId: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  meals: { type: DataTypes.JSON, allowNull: false },
  totalCalories: { type: DataTypes.INTEGER, allowNull: true },
  macros: { type: DataTypes.JSON, allowNull: false },
  aiGenerated: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, { tableName: 'Plan' });

const Patient = sequelize.define('Patient', {
  id: { type: DataTypes.STRING, primaryKey: true },
  nutritionistId: { type: DataTypes.STRING, allowNull: false },
  fullName: { type: DataTypes.STRING, allowNull: false },
  birthDate: { type: DataTypes.DATE, allowNull: true },
  sex: { type: DataTypes.STRING, allowNull: true },
  weight: { type: DataTypes.FLOAT, allowNull: true },
  height: { type: DataTypes.FLOAT, allowNull: true },
  goal: { type: DataTypes.STRING, allowNull: true },
  allergies: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
}, { tableName: 'Patient' });

const Appointment = sequelize.define('Appointment', {
  id: { type: DataTypes.STRING, primaryKey: true },
  nutritionistId: { type: DataTypes.STRING, allowNull: false },
  patientId: { type: DataTypes.STRING, allowNull: false },
  startAt: { type: DataTypes.DATE, allowNull: false },
  endAt: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'Appointment' });

const router = Router();

// Zod schemas
const mealSchema = z.object({
  time: z.string().min(1),
  title: z.string().min(1),
  items: z.array(z.string()).min(1),
  calories: z.number().int().positive().max(3000).nullable().optional(),
  macros: z.object({
    protein: z.number().min(0).max(300).nullable().optional(),
    carbs: z.number().min(0).max(600).nullable().optional(),
    fats: z.number().min(0).max(200).nullable().optional(),
  }).optional(),
});

const planBodySchema = z.object({
  patientId: z.string().min(1),
  appointmentId: z.string().min(1).optional(),
  name: z.string().min(2).max(255),
  description: z.string().max(10000).optional().nullable(),
  meals: z.array(mealSchema).min(1),
  totalCalories: z.number().int().positive().max(5000).nullable().optional(),
  macros: z.object({
    protein: z.number().min(0).max(400).nullable().optional(),
    carbs: z.number().min(0).max(800).nullable().optional(),
    fats: z.number().min(0).max(300).nullable().optional(),
  }).optional(),
  aiGenerated: z.boolean().optional(),
});

const aiInputSchema = z.object({
  patientId: z.string().min(1),
  appointmentId: z.string().min(1).optional(),
  name: z.string().min(2).max(255).default('Plano Alimentar'),
  preferences: z.object({ notes: z.string().max(1000).optional() }).optional(),
});

function ok(res, data) { return res.json({ status: 'success', data }); }
function created(res, data) { return res.status(201).json({ status: 'success', data }); }
function fail(res, code, message) { return res.status(code).json({ status: 'error', message }); }

// Helper: ownership checks
async function ensureOwnership(req, patientId, appointmentId) {
  const patient = await Patient.findOne({ where: { id: patientId, nutritionistId: req.user.id } });
  if (!patient) return { error: 'Paciente não encontrado' };
  if (appointmentId) {
    const appt = await Appointment.findOne({ where: { id: appointmentId, nutritionistId: req.user.id, patientId } });
    if (!appt) return { error: 'Consulta não encontrada para o paciente' };
  }
  return { patient };
}

// IA: gerar sugestão base (preview, sem salvar)
router.post('/planos/ia/sugestao', auth(true), async (req, res) => {
  try {
    const payload = aiInputSchema.parse(req.body);
    const own = await ensureOwnership(req, payload.patientId, payload.appointmentId);
    if (own.error) return fail(res, 404, own.error);

    const suggestion = await generatePlanSuggestion({ patient: own.patient.toJSON(), preferences: payload.preferences });
    return ok(res, { name: payload.name, suggestion });
  } catch (err) {
    if (err instanceof z.ZodError) return fail(res, 400, 'Dados inválidos');
    return fail(res, 500, 'Erro ao gerar sugestão');
  }
});

// Criar plano (manual ou via IA já editada)
router.post('/planos', auth(true), async (req, res) => {
  try {
    const body = planBodySchema.parse(req.body);
    const own = await ensureOwnership(req, body.patientId, body.appointmentId);
    if (own.error) return fail(res, 404, own.error);

    const createdPlan = await Plan.create({
      nutritionistId: req.user.id,
      patientId: body.patientId,
      appointmentId: body.appointmentId ?? null,
      name: body.name,
      description: body.description ?? null,
      meals: body.meals,
      totalCalories: body.totalCalories ?? null,
      macros: body.macros || { protein: null, carbs: null, fats: null },
      aiGenerated: Boolean(body.aiGenerated),
    });
    return created(res, { plan: createdPlan });
  } catch (err) {
    if (err instanceof z.ZodError) return fail(res, 400, 'Dados inválidos');
    return fail(res, 500, 'Erro ao criar plano');
  }
});

// Detalhar plano
router.get('/planos/:id', auth(true), async (req, res) => {
  try {
    const id = req.params.id;
    const plan = await Plan.findByPk(id);
    if (!plan) return fail(res, 404, 'Plano não encontrado');
    // ownership
    if (plan.nutritionistId !== req.user.id) return fail(res, 404, 'Plano não encontrado');
    return ok(res, { plan });
  } catch (_err) {
    return fail(res, 500, 'Erro ao carregar plano');
  }
});

// Listar planos de um paciente
router.get('/pacientes/:id/planos', auth(true), async (req, res) => {
  try {
    const patientId = req.params.id;
    const own = await ensureOwnership(req, patientId);
    if (own.error) return fail(res, 404, own.error);

    const items = await Plan.findAll({ where: { nutritionistId: req.user.id, patientId }, order: [['createdAt', 'DESC']] });
    return ok(res, { data: items });
  } catch (_err) {
    return fail(res, 500, 'Erro ao listar planos');
  }
});

// Atualizar plano
const updateSchema = planBodySchema.partial().extend({ patientId: z.string().min(1).optional() });
router.put('/planos/:id', auth(true), async (req, res) => {
  try {
    const id = req.params.id;
    const body = updateSchema.parse(req.body);
    const plan = await Plan.findByPk(id);
    if (!plan) return fail(res, 404, 'Plano não encontrado');
    if (plan.nutritionistId !== req.user.id) return fail(res, 404, 'Plano não encontrado');

    if (body.patientId !== undefined || body.appointmentId !== undefined) {
      const own = await ensureOwnership(req, body.patientId || plan.patientId, body.appointmentId || plan.appointmentId);
      if (own.error) return fail(res, 404, own.error);
    }

    await plan.update({
      ...(body.patientId ? { patientId: body.patientId } : {}),
      ...(body.appointmentId !== undefined ? { appointmentId: body.appointmentId ?? null } : {}),
      ...(body.name ? { name: body.name } : {}),
      ...(body.description !== undefined ? { description: body.description ?? null } : {}),
      ...(body.meals ? { meals: body.meals } : {}),
      ...(body.totalCalories !== undefined ? { totalCalories: body.totalCalories ?? null } : {}),
      ...(body.macros ? { macros: body.macros } : {}),
      ...(body.aiGenerated !== undefined ? { aiGenerated: Boolean(body.aiGenerated) } : {}),
    });
    return ok(res, { plan });
  } catch (err) {
    if (err instanceof z.ZodError) return fail(res, 400, 'Dados inválidos');
    return fail(res, 500, 'Erro ao atualizar plano');
  }
});

// Excluir plano
router.delete('/planos/:id', auth(true), async (req, res) => {
  try {
    const id = req.params.id;
    const plan = await Plan.findByPk(id);
    if (!plan) return fail(res, 404, 'Plano não encontrado');
    if (plan.nutritionistId !== req.user.id) return fail(res, 404, 'Plano não encontrado');
    await plan.destroy();
    return res.status(204).send();
  } catch (_err) {
    return fail(res, 500, 'Erro ao excluir plano');
  }
});

module.exports = router;


