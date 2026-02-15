// src/utils/backupUtils.ts - ARQUIVO COMPLETO
import { 
  UserProfile, 
  Client, 
  AppSettings, 
  PaymentMethod 
} from '../types';

// Função para criar backup automático
export const createAutomaticBackup = async (
  user: UserProfile,
  clients: Client[],
  settings: AppSettings,
  manualFloatAdjustments: Record<PaymentMethod, number>,
  invoiceCounter: number
) => {
  try {
    // Tentar incluir view e selectedClientId para restauração completa
    let view: string | null = null;
    let selectedClientId: string | null = null;
    try {
      // localforage pode não estar pronto em alguns ambientes; usar fallback
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const localforage = await import('localforage');
      view = await localforage.getItem('agent_view');
      selectedClientId = await localforage.getItem('agent_selected_client_id');
    } catch (err) {
      // Ignorar
    }

    const backupData = {
      user,
      clients,
      settings,
      manualFloatAdjustments,
      invoiceCounter,
      view,
      selectedClientId,
      timestamp: new Date().toISOString()
    };

    const backup = {
      versao: '2.0',
      tipo: 'backup_automatico',
      timestamp: new Date().toISOString(),
      conteudo: backupData
    };

    localStorage.setItem('super_agente_backup', JSON.stringify(backup));
    console.log('✅ Backup automático criado:', new Date().toLocaleString());
  } catch (error) {
    console.error('❌ Erro ao criar backup automático:', error);
  }
};

// Função para exportar dados locais
export const exportLocalData = (
  user: UserProfile,
  clients: Client[],
  settings: AppSettings,
  manualFloatAdjustments: Record<PaymentMethod, number>,
  invoiceCounter: number
) => {
  try {
    const exportData = {
      user,
      clients,
      settings,
      manualFloatAdjustments,
      invoiceCounter,
      timestamp: new Date().toISOString(),
      versao: '2.0'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `super-agente-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.style.display = 'none';
    document.body.appendChild(link);
    
    // Força o download
    setTimeout(() => {
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);

    console.log('✅ Dados exportados com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao exportar dados:', error);
    throw new Error('Erro ao exportar backup');
  }
};

// ⬇️⬇️⬇️ FUNÇÃO IMPORTAR DADOS ⬇️⬇️⬇️

// Função para importar dados locais
export const importLocalData = async (): Promise<{
  user: UserProfile;
  clients: Client[];
  settings: AppSettings;
  manualFloatAdjustments: Record<PaymentMethod, number>;
  invoiceCounter: number;
} | null> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';
    
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        // Validar estrutura do arquivo
        if (!data.user || !data.clients || !data.settings) {
          alert('❌ Erro: Arquivo de backup inválido. Certifique-se de que é um backup válido do Super Agente.');
          resolve(null);
          return;
        }
        
        // Validar tipos
        const validatedData = {
          user: data.user as UserProfile,
          clients: data.clients as Client[],
          settings: data.settings as AppSettings,
          manualFloatAdjustments: data.manualFloatAdjustments || {},
          invoiceCounter: data.invoiceCounter || 1
        };
        
        // Confirmação do usuário
        const confirmImport = window.confirm(
          `📋 IMPORTAR BACKUP?\n\n` +
          `👤 Usuário: ${validatedData.user.name}\n` +
          `👥 Clientes: ${validatedData.clients.length}\n` +
          `📅 Data do backup: ${data.timestamp ? new Date(data.timestamp).toLocaleString('pt-MZ') : 'Desconhecida'}\n\n` +
          `⚠️ Aviso: Isso substituirá seus dados atuais!\n` +
          `✅ Clique OK para continuar ou Cancelar para sair.`
        );
        
        if (confirmImport) {
          resolve(validatedData);
        } else {
          resolve(null);
        }
      } catch (error) {
        console.error('❌ Erro ao importar arquivo:', error);
        alert('❌ Erro ao processar arquivo de backup. Verifique se o arquivo está correto.');
        resolve(null);
      } finally {
        document.body.removeChild(input);
      }
    };
    
    input.oncancel = () => {
      resolve(null);
      if (document.body.contains(input)) {
        document.body.removeChild(input);
      }
    };
    
    document.body.appendChild(input);
    input.click();
  });
};

// Firebase sync removed for offline-only distribution