const { Router } = require('express');
const authRoutes = require('./auth.routes');
const patientRoutes = require('./patient.routes');
const appointmentRoutes = require('./appointment.routes');
const measurementRoutes = require('./measurement.routes');
const planRoutes = require('./plan.routes');

const router = Router();

router.use(authRoutes);
router.use(patientRoutes);
router.use(appointmentRoutes);
router.use(measurementRoutes);
router.use(planRoutes);

module.exports = router;


