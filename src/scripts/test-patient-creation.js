const { sequelize } = require('../sequelize');
const { defineModels } = require('../models');

async function testPatientCreation() {
  try {
    console.log('🧪 Testando criação de pacientes com mesmo email...');
    
    const { Patient, Nutritionist } = defineModels();
    
    // Criar dois nutricionistas de teste (se não existirem)
    const [nutri1] = await Nutritionist.findOrCreate({
      where: { email: 'nutri1@test.com' },
      defaults: {
        id: 'test-nutri-1',
        name: 'Nutricionista 1',
        email: 'nutri1@test.com',
        password: 'hashedpassword',
        role: 'nutritionist'
      }
    });
    
    const [nutri2] = await Nutritionist.findOrCreate({
      where: { email: 'nutri2@test.com' },
      defaults: {
        id: 'test-nutri-2',
        name: 'Nutricionista 2',
        email: 'nutri2@test.com',
        password: 'hashedpassword',
        role: 'nutritionist'
      }
    });
    
    console.log('✅ Nutricionistas de teste criados');
    
    // Tentar criar paciente com mesmo email para nutricionista 1
    try {
      const patient1 = await Patient.create({
        id: 'test-patient-1',
        nutritionistId: nutri1.id,
        fullName: 'João Silva',
        email: 'joao@test.com',
        phone: '11999999999'
      });
      console.log('✅ Paciente criado para Nutricionista 1:', patient1.fullName);
    } catch (error) {
      console.log('❌ Erro ao criar paciente para Nutricionista 1:', error.message);
    }
    
    // Tentar criar paciente com mesmo email para nutricionista 2
    try {
      const patient2 = await Patient.create({
        id: 'test-patient-2',
        nutritionistId: nutri2.id,
        fullName: 'João Santos',
        email: 'joao@test.com',
        phone: '11888888888'
      });
      console.log('✅ Paciente criado para Nutricionista 2:', patient2.fullName);
    } catch (error) {
      console.log('❌ Erro ao criar paciente para Nutricionista 2:', error.message);
    }
    
    // Tentar criar outro paciente com mesmo email para nutricionista 1 (deve dar erro)
    try {
      const patient3 = await Patient.create({
        id: 'test-patient-3',
        nutritionistId: nutri1.id,
        fullName: 'João Oliveira',
        email: 'joao@test.com',
        phone: '11777777777'
      });
      console.log('❌ ERRO: Conseguiu criar paciente duplicado para mesmo nutricionista!');
    } catch (error) {
      console.log('✅ Correto: Não permitiu paciente duplicado para mesmo nutricionista');
    }
    
    // Limpar dados de teste
    await Patient.destroy({ where: { id: ['test-patient-1', 'test-patient-2', 'test-patient-3'] } });
    await Nutritionist.destroy({ where: { id: ['test-nutri-1', 'test-nutri-2'] } });
    
    console.log('🧹 Dados de teste limpos');
    console.log('🎉 Teste concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante teste:', error.message);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  testPatientCreation();
}

module.exports = { testPatientCreation };
