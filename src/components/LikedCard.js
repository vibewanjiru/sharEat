import React, { useState, useEffect } from 'react';
import { ref, get, update } from 'firebase/database';
import { database, auth } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import './LikedCard.css';
import { IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const LikedCard = ({ recipe, likesCount, onShowRecipe }) => {
  const [user] = useAuthState(auth);
  const [liked, setLiked] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const userRef = ref(database, `users/${recipe.userId}`);
        console.log(`Fetching username for userId: ${recipe.userId}`); 
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
          setUsername(userSnapshot.val().username);
        } else {
          console.error(`User with ID ${recipe.userId} not found`);
          setUsername('Unknown User');
        }
      } catch (error) {
        console.error('Error fetching username:', error);
        setUsername('Unknown User');
      }
    };

    fetchUsername();
  }, [recipe.userId]);

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    setLiked(!liked);

    if (user) {
      const likesRef = ref(database, `likes/${user.uid}/${recipe.id}`);
      try {
        if (liked) {
          await update(likesRef, null); 
        } else {
          await update(likesRef, { liked: true }); 
        }
      } catch (error) {
        console.error('Error updating like status:', error);
      }
    }
  };

  return (
    <div className="liked-card" onClick={onShowRecipe}>
      <h2 className="liked-card-title">{recipe.title}</h2>
      <div className="liked-card-info">
        <span>Posted {recipe.timeAgo} by {username}</span>
        <div className="liked-card-actions">
          <IconButton onClick={handleLikeClick}>
            {liked ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteBorderIcon />}
          </IconButton>
          <span>{likesCount}</span>
        </div>
      </div>
      <hr className="divider" />
    </div>
  );
};

export default LikedCard;
