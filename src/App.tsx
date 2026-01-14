	//	 App.tsx (Versão com Contexto)

import React from 'react';
import AppContent from './components/AppContent';
import { AppProvider } from './contexts/AppContext';
import { useAppState } from './hooks/useAppState';

// Componente wrapper que fornece o contexto
const AppWithProvider: React.FC = () => {
  const appState = useAppState(); // Este hook contém toda a lógica do app
  
  return (
    <AppProvider value={appState}>
      <AppContent />
    </AppProvider>
  );
};

const App: React.FC = () => {
  return <AppWithProvider />;
};

export default App;