import { ref, push, set, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';

// Function to add a comment to a recipe
export const addComment = async (recipeId, userId, comment) => {
  try {
    const commentData = {
      userId,
      comment,
      createdAt: new Date().toISOString()
    };

    const commentsRef = ref(database, `comments/${recipeId}`);
    const newCommentRef = push(commentsRef);
    await set(newCommentRef, commentData);

    console.log('Comment added:', commentData);
    return { ...commentData, id: newCommentRef.key };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Function to fetch comments for a recipe
export const fetchComments = async (recipeId) => {
  try {
    const commentsRef = ref(database, `comments/${recipeId}`);
    return new Promise((resolve, reject) => {
      onValue(commentsRef, (snapshot) => {
        const data = snapshot.val();
        const comments = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        resolve(comments);
      }, (error) => {
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};
