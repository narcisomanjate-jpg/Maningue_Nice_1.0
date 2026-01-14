import localforage from 'localforage';

// Configurar localforage para usar IndexedDB quando possível
localforage.config({
  name: 'super_agente',
  storeName: 'agent_data',
  description: 'Armazenamento local do Super Agente'
});

(async () => {
  try {
    // Preferir IndexedDB, cair para localStorage se não suportado
    await localforage.setDriver([localforage.INDEXEDDB, localforage.LOCALSTORAGE]);
    console.log('localforage inicializado com IndexedDB/localStorage');
  } catch (error) {
    console.warn('localforage: não foi possível usar IndexedDB, fallback será usado', error);
  }
})();

// Além disso, verificar suporte básico ao IndexedDB nativo
if (!window.indexedDB) {
  console.warn('IndexedDB não suportado neste navegador. localforage usará o fallback (localStorage).');
}

export {};
