/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Measurement', 'notes', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'bodyFat',
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Measurement', 'notes');
  }
};


