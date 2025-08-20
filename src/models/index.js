const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');

const defineModels = () => {
  const Nutritionist = sequelize.define('Nutritionist', {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'nutritionist' },
  }, {
    tableName: 'Nutritionist',
  });

  const Patient = sequelize.define('Patient', {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
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
  }, {
    tableName: 'Patient',
  });

  const Appointment = sequelize.define('Appointment', {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    nutritionistId: { type: DataTypes.STRING, allowNull: false },
    patientId: { type: DataTypes.STRING, allowNull: false },
    startAt: { type: DataTypes.DATE, allowNull: false },
    endAt: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'scheduled' },
    notes: { type: DataTypes.TEXT, allowNull: true },
  }, {
    tableName: 'Appointment',
  });

  const Measurement = sequelize.define('Measurement', {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    patientId: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    weight: { type: DataTypes.FLOAT, allowNull: true },
    waist: { type: DataTypes.FLOAT, allowNull: true },
    hip: { type: DataTypes.FLOAT, allowNull: true },
    bodyFat: { type: DataTypes.FLOAT, allowNull: true },
  }, {
    tableName: 'Measurement',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false,
  });

  const Plan = sequelize.define('Plan', {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    patientId: { type: DataTypes.STRING, allowNull: false },
    nutritionistId: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    meals: { type: DataTypes.JSON, allowNull: false },
    totalCalories: { type: DataTypes.INTEGER, allowNull: true },
    macros: { type: DataTypes.JSON, allowNull: false },
    aiGenerated: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  }, {
    tableName: 'Plan',
  });

  const File = sequelize.define('File', {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    patientId: { type: DataTypes.STRING, allowNull: true },
    nutritionistId: { type: DataTypes.STRING, allowNull: true },
    filename: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    mime: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.INTEGER, allowNull: false },
    uploadedAt: { type: DataTypes.DATE, allowNull: false },
  }, {
    tableName: 'File',
    timestamps: false,
  });

  Nutritionist.hasMany(Patient, { foreignKey: 'nutritionistId', as: 'patients' });
  Nutritionist.hasMany(Appointment, { foreignKey: 'nutritionistId', as: 'appointments' });
  Patient.belongsTo(Nutritionist, { foreignKey: 'nutritionistId', as: 'nutritionist' });

  Appointment.belongsTo(Nutritionist, { foreignKey: 'nutritionistId', as: 'nutritionist' });
  Appointment.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

  Measurement.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
  Patient.hasMany(Measurement, { foreignKey: 'patientId', as: 'measurements' });

  Plan.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
  Plan.belongsTo(Nutritionist, { foreignKey: 'nutritionistId', as: 'nutritionist' });
  Patient.hasMany(Plan, { foreignKey: 'patientId', as: 'plans' });

  File.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
  File.belongsTo(Nutritionist, { foreignKey: 'nutritionistId', as: 'nutritionist' });
  Patient.hasMany(File, { foreignKey: 'patientId', as: 'files' });

  return { sequelize, Nutritionist, Patient, Appointment, Measurement, Plan, File };
};

module.exports = { defineModels };


