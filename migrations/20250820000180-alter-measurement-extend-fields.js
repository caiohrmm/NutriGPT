/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Numeric/body fields
    await queryInterface.addColumn('Measurement', 'heightCm', { type: Sequelize.FLOAT, allowNull: true, after: 'weight' });
    await queryInterface.addColumn('Measurement', 'bmi', { type: Sequelize.FLOAT, allowNull: true, after: 'heightCm' });
    await queryInterface.addColumn('Measurement', 'bodyFatPercentage', { type: Sequelize.FLOAT, allowNull: true, after: 'bmi' });
    await queryInterface.addColumn('Measurement', 'waistCircumference', { type: Sequelize.FLOAT, allowNull: true, after: 'bodyFat' });
    await queryInterface.addColumn('Measurement', 'hipCircumference', { type: Sequelize.FLOAT, allowNull: true, after: 'waistCircumference' });
    await queryInterface.addColumn('Measurement', 'armCircumference', { type: Sequelize.FLOAT, allowNull: true, after: 'hipCircumference' });
    // Ensure updatedAt exists for v1 routes (previously disabled)
    await queryInterface.addColumn('Measurement', 'updatedAt', { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') });

    // Optional unique (patientId, date) to avoid duplicates same day
    try {
      await queryInterface.addIndex('Measurement', ['patientId'], { name: 'idx_measurement_patientId' });
    } catch (_) {}
    try {
      await queryInterface.addConstraint('Measurement', {
        fields: ['patientId', 'date'],
        type: 'unique',
        name: 'uniq_measurement_patient_date',
      });
    } catch (_) {}
  },
  async down(queryInterface) {
    // Drop constraints/indexes first
    try { await queryInterface.removeConstraint('Measurement', 'uniq_measurement_patient_date'); } catch (_) {}
    try { await queryInterface.removeIndex('Measurement', 'idx_measurement_patientId'); } catch (_) {}

    await queryInterface.removeColumn('Measurement', 'updatedAt');
    await queryInterface.removeColumn('Measurement', 'armCircumference');
    await queryInterface.removeColumn('Measurement', 'hipCircumference');
    await queryInterface.removeColumn('Measurement', 'waistCircumference');
    await queryInterface.removeColumn('Measurement', 'bodyFatPercentage');
    await queryInterface.removeColumn('Measurement', 'bmi');
    await queryInterface.removeColumn('Measurement', 'heightCm');
  }
};


