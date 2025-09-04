const { Router } = require('express');
const { z } = require('zod');
const { signTokens, verifyRefresh } = require('../utils/jwt');
const { setAuthTokens, clearAuth } = require('../utils/authHelpers');
const { hashPassword, verifyPassword } = require('../utils/password');
const crypto = require('crypto');
const { sequelize } = require('../sequelize');
const { DataTypes } = require('sequelize');
const { auth } = require('../middleware/auth');
const { logger } = require('../utils/logger');

// Lightweight model here to avoid circular imports during bootstrap
const Nutritionist = sequelize.define('Nutritionist', {
  id: { type: DataTypes.STRING, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'nutritionist' },
}, { tableName: 'Nutritionist' });

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});


router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);
    const exists = await Nutritionist.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Email já registrado' });
    const hash = await hashPassword(password);
    const id = crypto.randomUUID();
    const user = await Nutritionist.create({ id, name, email, password: hash, role: 'nutritionist' });
    const { accessToken, refreshToken } = signTokens({ sub: user.id, role: user.role });
    setAuthTokens(res, { accessToken, refreshToken });
    return res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      tokens: { accessToken, refreshToken },
    });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ message: 'Dados inválidos', issues: err.issues });
    return res.status(500).json({ message: 'Erro ao registrar' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await Nutritionist.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });
    const ok = await verifyPassword(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Credenciais inválidas' });
    const { accessToken, refreshToken } = signTokens({ sub: user.id, role: user.role });
    setAuthTokens(res, { accessToken, refreshToken });
    return res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      tokens: { accessToken, refreshToken },
    });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ message: 'Dados inválidos', issues: err.issues });
    return res.status(500).json({ message: 'Erro ao autenticar' });
  }
});

router.post('/auth/refresh', async (req, res) => {
  try {
    const bodyRt = req.body && req.body.refreshToken;
    const cookieRt = req.cookies && (req.cookies.refreshToken || req.cookies.rt);
    const rt = bodyRt || cookieRt;
    if (!rt) return res.status(400).json({ message: 'refreshToken é obrigatório' });
    const payload = verifyRefresh(rt);
    const { accessToken, refreshToken: nextRefresh } = signTokens({ sub: payload.sub, role: payload.role });
    setAuthTokens(res, { accessToken, refreshToken: nextRefresh });
    return res.json({ tokens: { accessToken, refreshToken: nextRefresh } });
  } catch (err) {
    return res.status(401).json({ message: 'Refresh token inválido' });
  }
});

router.post('/auth/logout', async (_req, res) => {
  clearAuth(res);
  return res.status(204).send();
});

router.get('/me', auth(true), async (req, res) => {
  try {
    const user = await Nutritionist.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
    });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    return res.json({ user });
  } catch (_err) {
    return res.status(500).json({ message: 'Erro ao carregar o perfil' });
  }
});

// Update user profile
const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  currentPassword: z.string().min(1, 'Senha atual é obrigatória').optional(),
  newPassword: z.string().min(8, 'Nova senha deve ter pelo menos 8 caracteres').optional(),
});

router.put('/me', auth(true), async (req, res) => {
  try {
    const payload = updateProfileSchema.parse(req.body);
    const user = await Nutritionist.findByPk(req.user.id);
    
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    const updateData = {};

    // Update name if provided
    if (payload.name) {
      updateData.name = payload.name;
    }

    // Update password if provided
    if (payload.newPassword) {
      if (!payload.currentPassword) {
        return res.status(400).json({ message: 'Senha atual é obrigatória para alterar a senha' });
      }
      
      const isCurrentPasswordValid = await verifyPassword(payload.currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: 'Senha atual incorreta' });
      }
      
      updateData.password = await hashPassword(payload.newPassword);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'Nenhum dado para atualizar' });
    }

    await user.update(updateData);
    
    // Return updated user without password
    const updatedUser = await Nutritionist.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
    });
    
    return res.json({ user: updatedUser, message: 'Perfil atualizado com sucesso' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const details = err.issues.map((i) => ({ field: i.path.join('.'), message: i.message, code: i.code }));
      return res.status(400).json({ message: 'Dados inválidos', details });
    }
    logger?.error({ err }, 'profile.update.error');
    return res.status(500).json({ message: 'Erro ao atualizar perfil' });
  }
});

module.exports = router;


