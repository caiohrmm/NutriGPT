/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Plan', {
      id: { type: Sequelize.STRING(36), primaryKey: true, allowNull: false },
      patientId: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: { model: 'Patient', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nutritionistId: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: { model: 'Nutritionist', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      meals: { type: Sequelize.JSON, allowNull: false },
      totalCalories: { type: Sequelize.INTEGER, allowNull: true },
      macros: { type: Sequelize.JSON, allowNull: false },
      aiGenerated: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Plan');
  }
};


