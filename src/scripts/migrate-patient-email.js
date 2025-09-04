const { sequelize } = require('../sequelize');
const migration = require('../migrations/fix-patient-email-constraint');

async function runMigration() {
  try {
    console.log('🚀 Starting patient email constraint migration...');
    
    // Run the migration
    await migration.up(sequelize.getQueryInterface());
    
    console.log('✅ Migration completed successfully!');
    console.log('📝 Changes applied:');
    console.log('   - Removed global unique constraint on patient email');
    console.log('   - Added composite unique constraint on (email, nutritionistId)');
    console.log('   - Now multiple nutritionists can have patients with the same email');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
