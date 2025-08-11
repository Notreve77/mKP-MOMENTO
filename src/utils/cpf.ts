export const formatCPF = (value: string): string => {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '');
  
  // Limit to 11 digits
  const limited = numbers.substring(0, 11);
  
  // Apply CPF mask: 000.000.000-00
  return limited
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export const unformatCPF = (value: string): string => {
  return value.replace(/\D/g, '');
};

export const validateCPF = (cpf: string): boolean => {
  const numbers = unformatCPF(cpf);
  
  if (numbers.length !== 11) return false;
  
  // Check if all digits are the same
  if (/^(\d)\1{10}$/.test(numbers)) return false;
  
  // Validate check digits
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers[9])) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers[10])) return false;
  
  return true;
};