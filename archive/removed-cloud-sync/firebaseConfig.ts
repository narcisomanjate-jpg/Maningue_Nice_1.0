// Arquivado: firebaseConfig.ts (removido da árvore principal - usado para comunicação com Firebase)

// Preservado o stub atual para referência / possível re-ativação futura.
export const initializeFirebase = () => {
  // No-op
  return null as any;
};
export const getAuth = () => null as any;
export const getFirestore = () => null as any;
export const googleProvider = () => null as any;

export const syncDataToFirebase = async () => ({ success: false, error: 'Firebase removed' });
export const loadDataFromFirebase = async () => ({ success: false, error: 'Firebase removed', data: null });
export const loginWithGoogle = async () => ({ success: false, error: 'Firebase removed' });
export const loginWithEmail = async () => ({ success: false, error: 'Firebase removed' });
export const createUserWithEmail = async () => ({ success: false, error: 'Firebase removed' });
export const logoutUser = async () => ({ success: false, error: 'Firebase removed' });
export const onAuthStateChange = (_: any) => () => {};
