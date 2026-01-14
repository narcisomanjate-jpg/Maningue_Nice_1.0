// Converte hex para rgba
export const hexToRgba = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Cores pré-definidas
export const PRESET_COLORS = [
  '#3b82f6', '#f43f5e', '#10b981', '#f59e0b', 
  '#6366f1', '#a855f7', '#06b6d4', '#ec4899'
];

// Formatar data e hora
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}/${month} ${hours}:${minutes}`;
};

// Formatar apenas hora
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('pt-MZ', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Formatar data
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-MZ');
};

// Gerar ID único
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Validar número de telefone (simplificado)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{9,15}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

// Formatar valor monetário
export const formatCurrency = (amount: number, currency: string = 'MZN'): string => {
  return `${amount.toLocaleString()} ${currency}`;
};

// Capitalizar primeira letra
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Deep clone (simplificado)
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

// Calcular diferença de dias
export const daysDifference = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};