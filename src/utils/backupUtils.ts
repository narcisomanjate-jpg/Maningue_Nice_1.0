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
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('✅ Dados exportados com sucesso!');
    alert('✅ Backup exportado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao exportar dados:', error);
    alert('❌ Erro ao exportar backup.');
  }
};

// ⬇️⬇️⬇️ COLE AQUI A NOVA FUNÇÃO ⬇️⬇️⬇️

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
    
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('Nenhum arquivo selecionado'));
        return;
      }
      
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        // Validar estrutura do arquivo
        if (!data.user || !data.clients || !data.settings) {
          throw new Error('Arquivo de backup inválido');
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
          `Importar dados de backup?\n\n` +
          `Usuário: ${validatedData.user.name}\n` +
          `Clientes: ${validatedData.clients.length}\n` +
          `Data do backup: ${data.timestamp ? new Date(data.timestamp).toLocaleString() : 'Desconhecida'}\n\n` +
          `⚠️ Isso substituirá seus dados atuais!`
        );
        
        if (confirmImport) {
          resolve(validatedData);
        } else {
          reject(new Error('Importação cancelada pelo usuário'));
        }
      } catch (error) {
        console.error('❌ Erro ao importar arquivo:', error);
        reject(new Error('Erro ao processar arquivo de backup'));
      }
    };
    
    input.oncancel = () => {
      reject(new Error('Seleção de arquivo cancelada'));
    };
    
    input.click();
  });
};

// ⬆️⬆️⬆️ FIM DA NOVA FUNÇÃO ⬆️⬆️⬆️

// Firebase sync removed for offline-only distribution