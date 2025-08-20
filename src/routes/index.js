const { Router } = require('express');
const authRoutes = require('./auth.routes');
const patientRoutes = require('./patient.routes');
const appointmentRoutes = require('./appointment.routes');

const router = Router();

router.use(authRoutes);
router.use(patientRoutes);
router.use(appointmentRoutes);

module.exports = router;


