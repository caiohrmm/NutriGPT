/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Plan', 'isActive', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      after: 'aiGenerated',
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Plan', 'isActive');
  }
};
