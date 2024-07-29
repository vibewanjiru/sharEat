import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set, update } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, database, storage } from '../firebaseConfig';

// Function to update user info
export const updateUser = async (userId, updates) => {
  const userRef = ref(database, `users/${userId}`);

  let updatesToApply = {};

  if (updates.profileImage) {
    const profileImageRef = storageRef(storage, `users/${userId}/profileImage`);
    await uploadBytes(profileImageRef, updates.profileImage);
    updatesToApply.profileImageUrl = await getDownloadURL(profileImageRef);
  }

  if (updates.bgImage) {
    const bgImageRef = storageRef(storage, `users/${userId}/bgImage`);
    await uploadBytes(bgImageRef, updates.bgImage);
    updatesToApply.bgImageUrl = await getDownloadURL(bgImageRef);
  }

  // Add other updates that are not related to image uploads
  updatesToApply = { ...updatesToApply, ...updates };

  await update(userRef, updatesToApply);
};

// Function to register a new user
export const register = async (email, password, firstName, lastName, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Save additional user info in the database
    await set(ref(database, 'users/' + user.uid), {
      userId: user.uid,
      firstName,
      lastName,
      username,
      email,
      followers: [],
      following: [],
      profileImageUrl: '',
      bgImageUrl: '',
    });

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};
