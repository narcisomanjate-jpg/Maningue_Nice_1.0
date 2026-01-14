	//	Funções para importar contatos
	
// Importar contatos do dispositivo
export const importContactsFromDevice = async (): Promise<Array<{ name: string; phone: string }>> => {
  try {
    // Verificar se a API de contatos está disponível
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        // @ts-ignore
        const contactsManager = navigator.contacts as any;
        const props = ['name', 'tel'];
        const opts = { multiple: true };
        
        const contacts = await contactsManager.select(props, opts);
        return contacts
          .map((contact: any) => ({
            name: contact.name?.[0] || 'Sem nome',
            phone: contact.tel?.[0] || ''
          }))
          .filter((c: any) => c.phone && c.phone.trim() !== '');
      } catch (error: any) {
        if (error.name === 'AbortError') {
          // Usuário cancelou
          return [];
        }
        throw error;
      }
    } else {
      // Fallback para navegadores sem suporte
      return await fallbackImportContacts();
    }
  } catch (error: any) {
    console.error('❌ Erro ao importar contatos:', error);
    return await fallbackImportContacts();
  }
};

// Fallback para navegadores sem API de contatos
const fallbackImportContacts = async (): Promise<Array<{ name: string; phone: string }>> => {
  // Mostrar instruções para o usuário
  const instructions = `
Para importar contatos manualmente:

1. Abra sua lista de contatos no celular
2. Selecione os contatos que deseja importar
3. Copie os nomes e números
4. Cole no campo de busca do app

Ou cadastre os clientes manualmente clicando no botão "+".
`;

  alert(instructions);
  
  // Retornar array vazio
  return [];
};

// Validar e formatar número de telefone
export const formatPhoneNumber = (phone: string): string => {
  // Remover todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Verificar se tem código do país
  if (cleaned.startsWith('258')) {
    // Formato Mozambique: 258 XXXXXXXX
    return cleaned;
  } else if (cleaned.startsWith('+258')) {
    // Formato Mozambique com +
    return cleaned.substring(1);
  } else if (cleaned.length === 9) {
    // Número local Mozambique
    return '258' + cleaned;
  } else if (cleaned.length === 12 && cleaned.startsWith('258')) {
    // Já está no formato correto
    return cleaned;
  }
  
  // Retornar limpo se não corresponder a nenhum padrão
  return cleaned;
};

// Extrair contatos de texto colado
export const extractContactsFromText = (text: string): Array<{ name: string; phone: string }> => {
  const lines = text.split('\n');
  const contacts: Array<{ name: string; phone: string }> = [];
  
  lines.forEach(line => {
    // Remover espaços extras
    const trimmedLine = line.trim();
    if (!trimmedLine) return;
    
    // Tentar extrair nome e telefone
    // Padrão comum: Nome: 841234567
    // ou Nome 841234567
    const phoneMatch = trimmedLine.match(/(\d{9,15})/);
    if (phoneMatch) {
      const phone = phoneMatch[1];
      const name = trimmedLine.replace(phone, '').replace(/[:.\-]/g, '').trim();
      
      if (name) {
        contacts.push({
          name: name || 'Sem nome',
          phone: formatPhoneNumber(phone)
        });
      }
    }
  });
  
  return contacts;
};

// Verificar se número já existe na lista de clientes
export const isDuplicatePhone = (
  phone: string, 
  clients: Array<{ phone: string }>, 
  currentClientId?: string
): boolean => {
  const formattedPhone = formatPhoneNumber(phone);
  
  return clients.some(client => {
    if (currentClientId && 'id' in client && (client as any).id === currentClientId) {
      return false; // Ignorar o próprio cliente durante edição
    }
    return formatPhoneNumber(client.phone) === formattedPhone;
  });
};