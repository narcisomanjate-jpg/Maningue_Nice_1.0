// firebaseConfig.mock.ts - Versão mock para desenvolvimento
export const initializeFirebase = () => {
  console.log('Firebase mock: inicialização desativada');
  return null;
};

export const getAuth = () => {
  console.log('Firebase mock: getAuth retornando null');
  return null;
};

export const getFirestore = () => {
  console.log('Firebase mock: getFirestore retornando null');
  return null;
};

export const googleProvider = () => {
  console.log('Firebase mock: googleProvider retornando null');
  return null;
};

export const syncDataToFirebase = async () => {
  console.log('Firebase mock: syncDataToFirebase ignorado');
  return { success: false, error: 'Firebase não configurado' };
};

export const loadDataFromFirebase = async () => {
  console.log('Firebase mock: loadDataFromFirebase ignorado');
  return { success: false, error: 'Firebase não configurado', data: null };
};

export const onAuthStateChange = (_callback: (user: any) => void) => {
  console.log('Firebase mock: onAuthStateChange ignorado');
  return () => {}; // Função de cleanup vazia
};