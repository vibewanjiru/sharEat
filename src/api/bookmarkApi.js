import { ref, push, set, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';

// Function to add a bookmark to a recipe
export const addBookmark = async (recipeId, userId) => {
  try {
    const bookmarkData = {
      userId,
      createdAt: new Date().toISOString()
    };

    const bookmarksRef = ref(database, `bookmarks/${userId}`);
    const newBookmarkRef = push(bookmarksRef);
    await set(newBookmarkRef, { recipeId, createdAt: bookmarkData.createdAt });

    console.log('Bookmark added:', bookmarkData);
    return { ...bookmarkData, id: newBookmarkRef.key };
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw error;
  }
};

// Function to fetch bookmarks for a user
export const fetchBookmarks = async (userId) => {
  try {
    const bookmarksRef = ref(database, `bookmarks/${userId}`);
    return new Promise((resolve, reject) => {
      onValue(bookmarksRef, (snapshot) => {
        const data = snapshot.val();
        const bookmarks = data ? Object.keys(data).map(key => data[key].recipeId) : [];
        resolve(bookmarks);
      }, (error) => {
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    throw error;
  }
};
