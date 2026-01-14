	//	main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Se tiver um arquivo CSS global
// Inicializar localforage antes de qualquer acesso aos dados locais
import './utils/localforageConfig';
import App from './App';
// Registrar service worker (PWA) em produção para suporte offline
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  });
}

// Verificar se o elemento root existe
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Elemento root não encontrado');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Remover splash DOM quando o React já tiver renderizado
const removeSplash = () => {
  const s = document.getElementById('app-splash');
  if (s) {
    s.style.transition = 'opacity 300ms ease';
    s.style.opacity = '0';
    setTimeout(() => s.remove(), 350);
  }
};

// Remover após render
removeSplash();