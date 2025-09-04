const { sequelize } = require('../sequelize');

async function fixPatientEmailConstraint() {
  try {
    console.log('🚀 Iniciando correção da constraint de email do paciente...');
    
    // Force sync models to apply the new index structure
    // This will create the new composite index and remove the old unique constraint
    await sequelize.sync({ alter: true });
    
    console.log('✅ Correção aplicada com sucesso!');
    console.log('📝 Mudanças aplicadas:');
    console.log('   - Constraint única global no email removida');
    console.log('   - Constraint única composta (email, nutritionistId) adicionada');
    console.log('   - Agora múltiplos nutricionistas podem ter pacientes com o mesmo email');
    
  } catch (error) {
    console.error('❌ Erro ao aplicar correção:', error.message);
    
    if (error.message.includes('Access denied')) {
      console.log('\n💡 Dica: Verifique suas credenciais do MySQL');
      console.log('   - Verifique se o MySQL está rodando');
      console.log('   - Verifique o arquivo .env com as credenciais corretas');
      console.log('   - Ou inicie o servidor normalmente que o Sequelize aplicará as mudanças automaticamente');
    }
    
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run the fix if this script is executed directly
if (require.main === module) {
  fixPatientEmailConstraint();
}

module.exports = { fixPatientEmailConstraint };
