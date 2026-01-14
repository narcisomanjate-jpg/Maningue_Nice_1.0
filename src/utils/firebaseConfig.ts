// Firebase utilities removed for offline-only distribution.
// This file is a placeholder to avoid import errors from older branches.

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