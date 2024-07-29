import React from 'react';
import './MyRecipeCard.css';
import { IconButton } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

const MyRecipeCard = ({ title, timeAgo,}) => {
  return (
    <div className="recipe-card">
      <h2 className="recipe-title">{title}</h2>
      <div className="recipe-info">
        <span>Posted {timeAgo}</span>
        <div className="recipe-actions">
          <IconButton>
            <BookmarkBorderIcon />
          </IconButton>
        </div>
      </div>
      <hr className="divider" />
    </div>
  );
};

export default MyRecipeCard;
