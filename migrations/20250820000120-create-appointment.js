/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Appointment', {
      id: { type: Sequelize.STRING(36), primaryKey: true, allowNull: false, defaultValue: Sequelize.literal('UUID()') },
      nutritionistId: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: { model: 'Nutritionist', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      patientId: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: { model: 'Patient', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      startAt: { type: Sequelize.DATE, allowNull: false },
      endAt: { type: Sequelize.DATE, allowNull: false },
      status: { type: Sequelize.STRING, allowNull: false, defaultValue: 'scheduled' },
      notes: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Appointment');
  }
};


