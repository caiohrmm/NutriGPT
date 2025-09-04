/**
 * Calcula a idade em anos e meses a partir da data de nascimento
 * @param {string|Date} birthDate - Data de nascimento
 * @returns {string} - Idade formatada (ex: "25 anos, 3 meses" ou "2 meses" ou "Não informado")
 */
export function calculateAge(birthDate) {
  if (!birthDate) return 'Não informado';
  
  const birth = new Date(birthDate);
  const today = new Date();
  
  // Verificar se a data é válida
  if (isNaN(birth.getTime())) return 'Data inválida';
  
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  
  // Ajustar se ainda não fez aniversário este ano
  if (months < 0) {
    years--;
    months += 12;
  }
  
  // Ajustar se ainda não chegou no dia do mês
  if (today.getDate() < birth.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }
  
  // Formatação da idade
  if (years === 0 && months === 0) {
    return 'Recém-nascido';
  } else if (years === 0) {
    return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  } else if (months === 0) {
    return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  } else {
    return `${years} ${years === 1 ? 'ano' : 'anos'}, ${months} ${months === 1 ? 'mês' : 'meses'}`;
  }
}

/**
 * Formata data para exibição no padrão brasileiro
 * @param {string|Date} date - Data para formatar
 * @returns {string} - Data formatada (dd/mm/aaaa)
 */
export function formatDate(date) {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  return d.toLocaleDateString('pt-BR');
}

/**
 * Formata data para input do tipo date (yyyy-mm-dd)
 * @param {string|Date} date - Data para formatar
 * @returns {string} - Data formatada para input
 */
export function formatDateForInput(date) {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  return d.toISOString().split('T')[0];
}

/**
 * Obtém a data de hoje no formato yyyy-mm-dd para usar como max em inputs
 * @returns {string} - Data de hoje
 */
export function getTodayForInput() {
  return new Date().toISOString().split('T')[0];
}
