import { ref, get } from 'firebase/database';
import { database } from '../firebaseConfig';

export const getUserProfile = async (userId) => {
  const userRef = ref(database, `users/${userId}`);
  const snapshot = await get(userRef);

  if (!snapshot.exists()) {
    throw new Error('User not found');
  }

  return snapshot.val();
};
