const { sequelize } = require('../sequelize');
const { defineModels } = require('../models');

async function forceModelSync() {
  try {
    console.log('🚀 Forçando sincronização dos modelos...');
    
    // Define models
    const { Patient } = defineModels();
    
    console.log('📊 Aplicando alterações na tabela Patient...');
    
    // Force alter the Patient table to match the new model
    await Patient.sync({ alter: true, force: false });
    
    console.log('✅ Tabela Patient sincronizada com sucesso!');
    console.log('📝 Mudanças aplicadas:');
    console.log('   - Constraint única global no email removida/ajustada');
    console.log('   - Índice único composto (email, nutritionistId) aplicado');
    console.log('   - Agora múltiplos nutricionistas podem ter pacientes com o mesmo email');
    
  } catch (error) {
    console.error('❌ Erro durante sincronização:', error.message);
    
    if (error.name === 'SequelizeConnectionError') {
      console.log('\n💡 Erro de conexão com o banco de dados');
      console.log('   - Verifique se o MySQL/MariaDB está rodando');
      console.log('   - Verifique as credenciais no arquivo .env ou src/sequelize.js');
    }
    
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  forceModelSync();
}

module.exports = { forceModelSync };
