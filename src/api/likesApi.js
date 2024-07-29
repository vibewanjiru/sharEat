import { ref, push, set, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';

// Function to add a like to a recipe
export const addLike = async (recipeId, userId) => {
  try {
    const likeData = {
      userId,
      createdAt: new Date().toISOString()
    };

    const likesRef = ref(database, `likes/${userId}`);
    const newLikeRef = push(likesRef);
    await set(newLikeRef, { recipeId, createdAt: likeData.createdAt });

    console.log('Like added:', likeData);
    return { ...likeData, id: newLikeRef.key };
  } catch (error) {
    console.error('Error adding like:', error);
    throw error;
  }
};

// Function to fetch likes for a recipe
export const fetchLikes = async (userId) => {
  try {
    const likesRef = ref(database, `likes/${userId}`);
    return new Promise((resolve, reject) => {
      onValue(likesRef, (snapshot) => {
        const data = snapshot.val();
        const likes = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        resolve(likes);
      }, (error) => {
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error fetching likes:', error);
    throw error;
  }
};
