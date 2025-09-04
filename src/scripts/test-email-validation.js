const { sequelize } = require('../sequelize');
const { defineModels } = require('../models');

async function testEmailValidation() {
  try {
    console.log('🧪 Testando validações de email...');
    
    const { Patient, Nutritionist } = defineModels();
    
    // Criar nutricionista de teste
    const [nutri] = await Nutritionist.findOrCreate({
      where: { email: 'dr.silva@nutrigpt.com' },
      defaults: {
        id: 'test-nutri-validation',
        name: 'Dr. Silva',
        email: 'dr.silva@nutrigpt.com',
        password: 'hashedpassword',
        role: 'nutritionist'
      }
    });
    
    console.log('✅ Nutricionista de teste criado:', nutri.email);
    
    // Teste 1: Tentar criar paciente com email diferente (deve funcionar)
    try {
      const patient1 = await Patient.create({
        id: 'test-patient-different-email',
        nutritionistId: nutri.id,
        fullName: 'João Silva',
        email: 'joao@email.com'
      });
      console.log('✅ Teste 1 PASSOU: Paciente criado com email diferente');
      await patient1.destroy();
    } catch (error) {
      console.log('❌ Teste 1 FALHOU:', error.message);
    }
    
    // Teste 2: Tentar criar paciente com mesmo email do nutricionista (deve falhar)
    try {
      const patient2 = await Patient.create({
        id: 'test-patient-same-email',
        nutritionistId: nutri.id,
        fullName: 'Dr. Silva Paciente',
        email: 'dr.silva@nutrigpt.com' // MESMO EMAIL DO NUTRICIONISTA
      });
      console.log('❌ Teste 2 FALHOU: Conseguiu criar paciente com email do nutricionista!');
      await patient2.destroy();
    } catch (error) {
      console.log('✅ Teste 2 PASSOU: Corretamente bloqueou email igual ao do nutricionista');
    }
    
    // Teste 3: Criar dois pacientes com mesmo email para nutricionistas diferentes
    const [nutri2] = await Nutritionist.findOrCreate({
      where: { email: 'dra.santos@nutrigpt.com' },
      defaults: {
        id: 'test-nutri-validation-2',
        name: 'Dra. Santos',
        email: 'dra.santos@nutrigpt.com',
        password: 'hashedpassword',
        role: 'nutritionist'
      }
    });
    
    try {
      const patient3 = await Patient.create({
        id: 'test-patient-nutri1',
        nutritionistId: nutri.id,
        fullName: 'Maria Silva',
        email: 'maria@email.com'
      });
      
      const patient4 = await Patient.create({
        id: 'test-patient-nutri2',
        nutritionistId: nutri2.id,
        fullName: 'Maria Santos',
        email: 'maria@email.com' // MESMO EMAIL, NUTRICIONISTA DIFERENTE
      });
      
      console.log('✅ Teste 3 PASSOU: Nutricionistas diferentes podem ter pacientes com mesmo email');
      await patient3.destroy();
      await patient4.destroy();
    } catch (error) {
      console.log('❌ Teste 3 FALHOU:', error.message);
    }
    
    // Limpar dados de teste
    await Nutritionist.destroy({ where: { id: ['test-nutri-validation', 'test-nutri-validation-2'] } });
    
    console.log('🧹 Dados de teste limpos');
    console.log('🎉 Testes concluídos!');
    
  } catch (error) {
    console.error('❌ Erro durante testes:', error.message);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  testEmailValidation();
}

module.exports = { testEmailValidation };
