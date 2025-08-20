const { Router } = require('express');
const authRoutes = require('./auth.routes');
const patientRoutes = require('./patient.routes');

const router = Router();

router.use(authRoutes);
router.use(patientRoutes);

module.exports = router;


