/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('File', {
      id: { type: Sequelize.STRING(36), primaryKey: true, allowNull: false, defaultValue: Sequelize.literal('UUID()') },
      patientId: {
        type: Sequelize.STRING(36),
        allowNull: true,
        references: { model: 'Patient', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      nutritionistId: {
        type: Sequelize.STRING(36),
        allowNull: true,
        references: { model: 'Nutritionist', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      filename: { type: Sequelize.STRING, allowNull: false },
      url: { type: Sequelize.STRING, allowNull: false },
      mime: { type: Sequelize.STRING, allowNull: false },
      size: { type: Sequelize.INTEGER, allowNull: false },
      uploadedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('File');
  }
};


