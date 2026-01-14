		//	ModalsContainer.tsx

import React from 'react';
import { useApp } from '../../hooks/useApp';
import AddClientModal from './AddClientModal';
import EditClientModal from './EditClientModal';
import TransactionModal from './TransactionModal';
import EditTransactionModal from './EditTransactionModal';
import FloatManagementModal from './FloatManagementModal';
import SMSConfirmModal from './SMSConfirmModal';
import SMSOptionsModal from './SMSOptionsModal';

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
    
    // Dados para modais
    editingTransaction,
    selectedClient
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
      
      {/* Modal de Prompt de Sincronização Automática */}
    </>
  );
};

export default ModalsContainer;