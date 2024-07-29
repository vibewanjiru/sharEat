import { ref, push, update } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database, storage } from '../firebaseConfig';

export const createRecipe = async (title, content, userId, photo) => {
  if (!photo) {
    throw new Error("Please upload a photo");
  }

  try {
    const photoStorageRef = storageRef(storage, `photos/${photo.name}`);
    await uploadBytes(photoStorageRef, photo);
    const photoURL = await getDownloadURL(photoStorageRef);

    const newRecipe = {
      title,
      content,
      createdAt: new Date().toISOString(),
      photoURL,
      userId
    };

    console.log('New recipe data:', newRecipe);

    const recipeRef = await push(ref(database, 'recipes'), newRecipe);
    console.log('Recipe created with ID:', recipeRef.key);
    
    return newRecipe;
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
};

export const addComment = async (recipeId, commentId, commentData) => {
  const commentRef = ref(database, `recipes/${recipeId}/comments/${commentId}`);
  await update(commentRef, commentData);
};

export const addLike = async (recipeId, userId) => {
  const likeRef = ref(database, `recipes/${recipeId}/likes/${userId}`);
  await update(likeRef, true); // Assuming a like is represented by a boolean
};