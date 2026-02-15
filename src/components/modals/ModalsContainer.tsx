import React from 'react';
import { useApp } from '../../hooks/useApp';
import AddClientModal from './AddClientModal';
import EditClientModal from './EditClientModal';
import TransactionModal from './TransactionModal';
import EditTransactionModal from './EditTransactionModal';
import FloatManagementModal from './FloatManagementModal';
import SMSConfirmModal from './SMSConfirmModal';
import SMSOptionsModal from './SMSOptionsModal';
import InvoiceModal from './InvoiceModal';

const ModalsContainer: React.FC = () => {
  const {
    // Estados dos modais
    showAddClient,
    showEditClient,
    showTransactionModal,
    showEditTransactionModal,
    showFloatModal,
    showSMSConfirmModal,
    showSMSOptionsModal,
    showInvoiceModal,
    
    // Dados para modais
    editingTransaction,
    selectedClient,
    currentInvoiceData,
    setShowInvoiceModal
  } = useApp();

  return (
    <>
      {/* Modal de Novo Cliente */}
      {showAddClient && <AddClientModal />}
      
      {/* Modal de Editar Cliente */}
      {showEditClient && selectedClient && <EditClientModal />}
      
      {/* Modal de Nova Transação */}
      {showTransactionModal.show && <TransactionModal />}
      
      {/* Modal de Editar Transação */}
      {showEditTransactionModal && editingTransaction && <EditTransactionModal />}
      
      {/* Modal de Gestão de Float */}
      {showFloatModal && <FloatManagementModal />}
      
      {/* Modal de Confirmação de SMS */}
      {showSMSConfirmModal.show && <SMSConfirmModal />}
      
      {/* Modal de Opções de SMS */}
      {showSMSOptionsModal && selectedClient && <SMSOptionsModal />}
      
      {/* Modal de Visualização de Fatura */}
      {showInvoiceModal && currentInvoiceData && (
        <InvoiceModal 
          client={currentInvoiceData.client}
          archiveData={currentInvoiceData.archiveData}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
      
      {/* Modal de Prompt de Sincronização Automática */}
    </>
  );
};

export default ModalsContainer;