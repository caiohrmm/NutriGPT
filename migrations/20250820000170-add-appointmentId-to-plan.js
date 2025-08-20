/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Plan', 'appointmentId', {
      type: Sequelize.STRING(36),
      allowNull: true,
      references: { model: 'Appointment', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      after: 'patientId',
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Plan', 'appointmentId');
  }
};


