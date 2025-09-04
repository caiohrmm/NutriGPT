const { QueryInterface, DataTypes, Op } = require('sequelize');

/**
 * Migration to fix patient email constraint
 * - Remove global unique constraint on email
 * - Add composite unique constraint on (email, nutritionistId) for non-null emails
 */

module.exports = {
  async up(queryInterface) {
    try {
      // 1. Remove the existing unique constraint on email (if exists)
      try {
        await queryInterface.removeConstraint('Patient', 'Patient_email_key');
      } catch (error) {
        console.log('Constraint Patient_email_key not found or already removed');
      }

      // Try alternative constraint names
      try {
        await queryInterface.removeConstraint('Patient', 'email');
      } catch (error) {
        console.log('Constraint email not found or already removed');
      }

      // 2. Remove unique index on email (if exists)
      try {
        await queryInterface.removeIndex('Patient', 'Patient_email_key');
      } catch (error) {
        console.log('Index Patient_email_key not found or already removed');
      }

      try {
        await queryInterface.removeIndex('Patient', ['email']);
      } catch (error) {
        console.log('Index on email not found or already removed');
      }

      // 3. Add composite unique index on (email, nutritionistId) for non-null emails
      await queryInterface.addIndex('Patient', {
        fields: ['email', 'nutritionistId'],
        unique: true,
        name: 'patient_email_nutritionist_unique',
        where: {
          email: { [Op.ne]: null }
        }
      });

      console.log('✅ Patient email constraint migration completed successfully');
    } catch (error) {
      console.error('❌ Error during patient email constraint migration:', error);
      throw error;
    }
  },

  async down(queryInterface) {
    try {
      // Remove the composite unique index
      await queryInterface.removeIndex('Patient', 'patient_email_nutritionist_unique');
      
      // Restore global unique constraint on email
      await queryInterface.addIndex('Patient', {
        fields: ['email'],
        unique: true,
        name: 'Patient_email_key'
      });

      console.log('✅ Patient email constraint rollback completed successfully');
    } catch (error) {
      console.error('❌ Error during patient email constraint rollback:', error);
      throw error;
    }
  }
};
