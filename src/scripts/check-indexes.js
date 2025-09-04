const { sequelize } = require('../sequelize');

async function checkIndexes() {
  try {
    const [results] = await sequelize.query('SHOW INDEX FROM Patient WHERE Column_name = "email"');
    console.log('📋 Índices no campo email:');
    results.forEach(index => {
      console.log(`   - ${index.Key_name}: ${index.Non_unique ? 'Não único' : 'Único'} (Colunas: ${index.Column_name})`);
    });
    
    // Verificar se há índices duplicados
    const uniqueIndexes = results.filter(index => index.Non_unique === 0);
    if (uniqueIndexes.length > 1) {
      console.log('\n⚠️ PROBLEMA: Múltiplos índices únicos encontrados!');
      console.log('🔧 Removendo índices duplicados...');
      
      // Remover índices duplicados, mantendo apenas o composto
      for (const index of uniqueIndexes) {
        if (index.Key_name !== 'patient_email_nutritionist_unique' && index.Key_name !== 'patient_email_nutritionist_id') {
          try {
            await sequelize.query(`ALTER TABLE Patient DROP INDEX \`${index.Key_name}\``);
            console.log(`✅ Índice ${index.Key_name} removido`);
          } catch (error) {
            console.log(`⚠️ Erro ao remover ${index.Key_name}:`, error.message);
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkIndexes();
