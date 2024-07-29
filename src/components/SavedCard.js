import React, { useState, useEffect } from 'react';
import { ref, update } from 'firebase/database';
import { database, auth } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import './SavedCard.css';
import { IconButton } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const SavedCard = ({ recipe, bookmarksCount, onShowRecipe }) => {
  const [user] = useAuthState(auth);
  const [bookmarked, setBookmarked] = useState(true);

  useEffect(() => {
    
  }, [recipe]);

  const handleBookmarkClick = async (e) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);

    if (user) {
      const bookmarksRef = ref(database, `bookmarks/${user.uid}/${recipe.id}`);
      try {
        if (bookmarked) {
          await update(bookmarksRef, null); 
        } else {
          await update(bookmarksRef, { bookmarked: true }); 
        }
      } catch (error) {
        console.error('Error updating bookmark status:', error);
      }
    }
  };

  return (
    <div className="saved-card" onClick={onShowRecipe}>
      <h2 className="saved-card-title">{recipe.title || 'Untitled Recipe'}</h2>
      <div className="saved-card-info">
        <span>Posted {recipe.timeAgo} by {recipe.username || 'Unknown User'}</span>
        <div className="saved-card-actions">
          <IconButton onClick={handleBookmarkClick}>
            {bookmarked ? <BookmarkIcon style={{ color: 'blue' }} /> : <BookmarkBorderIcon />}
          </IconButton>
          <span>{bookmarksCount}</span>
        </div>
      </div>
      <hr className="divider" />
    </div>
  );
};

export default SavedCard;
