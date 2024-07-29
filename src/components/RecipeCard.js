import React from 'react';
import './RecipeCard.css';
import { IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

const RecipeCard = ({ title, timeAgo, likes, comments }) => {
  return (
    <div className="recipe-card">
      <h2 className="recipe-title">{title}</h2>
      <div className="recipe-info">
        <span>{timeAgo} ago</span>
        <div className="recipe-actions">
          <IconButton>
            <FavoriteBorderIcon />
            <span>{likes}</span>
          </IconButton>
          <IconButton>
            <CommentIcon />
            <span></span>
          </IconButton>
          <IconButton>
            <BookmarkBorderIcon />
          </IconButton>
        </div>
      </div>
      <hr className="divider" />
    </div>
  );
};

export default RecipeCard;
