const { sequelize } = require('../sequelize');

async function checkAndFixConstraint() {
  try {
    console.log('🔍 Verificando constraints existentes no banco...');
    
    // Verificar constraints existentes
    const [constraints] = await sequelize.query(`
      SELECT CONSTRAINT_NAME, CONSTRAINT_TYPE 
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'Patient' 
      AND CONSTRAINT_TYPE = 'UNIQUE'
    `);
    
    console.log('📋 Constraints encontradas:', constraints);
    
    // Verificar índices existentes
    const [indexes] = await sequelize.query(`
      SHOW INDEX FROM Patient WHERE Column_name = 'email'
    `);
    
    console.log('📋 Índices no campo email:', indexes);
    
    // Remover constraint única no email se existir
    for (const constraint of constraints) {
      if (constraint.CONSTRAINT_NAME.includes('email') && !constraint.CONSTRAINT_NAME.includes('nutritionist')) {
        try {
          console.log(`🗑️ Removendo constraint: ${constraint.CONSTRAINT_NAME}`);
          await sequelize.query(`ALTER TABLE Patient DROP INDEX \`${constraint.CONSTRAINT_NAME}\``);
          console.log(`✅ Constraint ${constraint.CONSTRAINT_NAME} removida`);
        } catch (error) {
          console.log(`⚠️ Erro ao remover ${constraint.CONSTRAINT_NAME}:`, error.message);
        }
      }
    }
    
    // Remover índices únicos no email se existirem
    for (const index of indexes) {
      if (index.Non_unique === 0 && !index.Key_name.includes('nutritionist')) {
        try {
          console.log(`🗑️ Removendo índice único: ${index.Key_name}`);
          await sequelize.query(`ALTER TABLE Patient DROP INDEX \`${index.Key_name}\``);
          console.log(`✅ Índice ${index.Key_name} removido`);
        } catch (error) {
          console.log(`⚠️ Erro ao remover ${index.Key_name}:`, error.message);
        }
      }
    }
    
    // Verificar se o índice composto existe
    const [compositeIndex] = await sequelize.query(`
      SHOW INDEX FROM Patient WHERE Key_name = 'patient_email_nutritionist_unique'
    `);
    
    if (compositeIndex.length === 0) {
      console.log('➕ Criando índice único composto (email, nutritionistId)...');
      await sequelize.query(`
        ALTER TABLE Patient 
        ADD UNIQUE INDEX patient_email_nutritionist_unique (email, nutritionistId)
      `);
      console.log('✅ Índice único composto criado!');
    } else {
      console.log('✅ Índice único composto já existe');
    }
    
    // Verificar resultado final
    const [finalIndexes] = await sequelize.query(`
      SHOW INDEX FROM Patient WHERE Column_name = 'email'
    `);
    
    console.log('\n🎉 Estado final dos índices no campo email:');
    finalIndexes.forEach(index => {
      console.log(`   - ${index.Key_name}: ${index.Non_unique ? 'Não único' : 'Único'} (${index.Column_name})`);
    });
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  checkAndFixConstraint();
}

module.exports = { checkAndFixConstraint };
