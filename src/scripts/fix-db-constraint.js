const mysql = require('mysql2/promise');

async function fixDatabaseConstraint() {
  let connection;
  
  try {
    console.log('🚀 Tentando conectar ao MySQL...');
    
    // Tenta conectar sem senha primeiro
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'nutrigpt'
    });
    
    console.log('✅ Conectado ao MySQL com sucesso!');
    
    // 1. Verificar se a constraint existe
    console.log('🔍 Verificando constraints existentes...');
    const [constraints] = await connection.execute(`
      SELECT CONSTRAINT_NAME 
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
      WHERE TABLE_SCHEMA = 'nutrigpt' 
      AND TABLE_NAME = 'Patient' 
      AND CONSTRAINT_TYPE = 'UNIQUE'
      AND CONSTRAINT_NAME LIKE '%email%'
    `);
    
    // 2. Remover constraint única no email (se existir)
    for (const constraint of constraints) {
      try {
        console.log(`🗑️ Removendo constraint: ${constraint.CONSTRAINT_NAME}`);
        await connection.execute(`ALTER TABLE Patient DROP INDEX \`${constraint.CONSTRAINT_NAME}\``);
        console.log(`✅ Constraint ${constraint.CONSTRAINT_NAME} removida`);
      } catch (error) {
        console.log(`⚠️ Constraint ${constraint.CONSTRAINT_NAME} não pôde ser removida:`, error.message);
      }
    }
    
    // 3. Verificar se o índice composto já existe
    const [indexes] = await connection.execute(`
      SHOW INDEX FROM Patient WHERE Key_name = 'patient_email_nutritionist_unique'
    `);
    
    if (indexes.length === 0) {
      // 4. Criar índice único composto
      console.log('➕ Criando índice único composto (email, nutritionistId)...');
      await connection.execute(`
        ALTER TABLE Patient 
        ADD UNIQUE INDEX patient_email_nutritionist_unique (email, nutritionistId)
      `);
      console.log('✅ Índice único composto criado com sucesso!');
    } else {
      console.log('✅ Índice único composto já existe');
    }
    
    console.log('\n🎉 Correção aplicada com sucesso!');
    console.log('📝 Agora nutricionistas diferentes podem ter pacientes com o mesmo email');
    
  } catch (error) {
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('❌ Erro de acesso ao MySQL');
      console.log('\n💡 Possíveis soluções:');
      console.log('1. Configure uma senha para o usuário root do MySQL');
      console.log('2. Ou crie um arquivo .env com as credenciais corretas');
      console.log('3. Ou execute: mysql -u root -p');
      console.log('   E execute manualmente:');
      console.log('   ALTER TABLE Patient DROP INDEX email;');
      console.log('   ALTER TABLE Patient ADD UNIQUE INDEX patient_email_nutritionist_unique (email, nutritionistId);');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('❌ Banco de dados "nutrigpt" não encontrado');
      console.log('\n💡 Crie o banco primeiro:');
      console.log('   CREATE DATABASE nutrigpt;');
    } else {
      console.error('❌ Erro:', error.message);
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

if (require.main === module) {
  fixDatabaseConstraint();
}

module.exports = { fixDatabaseConstraint };
