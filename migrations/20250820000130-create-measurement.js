/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Measurement', {
      id: { type: Sequelize.STRING(36), primaryKey: true, allowNull: false },
      patientId: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: { model: 'Patient', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      date: { type: Sequelize.DATE, allowNull: false },
      weight: { type: Sequelize.FLOAT, allowNull: true },
      waist: { type: Sequelize.FLOAT, allowNull: true },
      hip: { type: Sequelize.FLOAT, allowNull: true },
      bodyFat: { type: Sequelize.FLOAT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Measurement');
  }
};


