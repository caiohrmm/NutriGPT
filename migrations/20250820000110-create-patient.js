/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Patient', {
      id: { type: Sequelize.STRING(36), primaryKey: true, allowNull: false, defaultValue: Sequelize.literal('UUID()') },
      nutritionistId: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: { model: 'Nutritionist', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      fullName: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: true, unique: true },
      phone: { type: Sequelize.STRING, allowNull: true },
      birthDate: { type: Sequelize.DATE, allowNull: true },
      sex: { type: Sequelize.STRING, allowNull: true },
      weight: { type: Sequelize.FLOAT, allowNull: true },
      height: { type: Sequelize.FLOAT, allowNull: true },
      goal: { type: Sequelize.STRING, allowNull: true },
      allergies: { type: Sequelize.JSON, allowNull: false, defaultValue: [] },
      notes: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Patient');
  }
};


