
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { ref, get, remove } from 'firebase/database';
import { database } from '../firebaseConfig';
import './FeedCard.css';
import { Button, IconButton, Avatar } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CommentIcon from '@mui/icons-material/Comment';
import CommentDialog from './CommentDialog';
import { addLike, fetchLikes } from '../api/likesApi';
import { addBookmark, fetchBookmarks } from '../api/bookmarkApi';
import { fetchComments, addComment as addCommentToDb } from '../api/commentsApi';

const FeedCard = ({ recipe, onShowRecipe }) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isCommentDialogOpen, setCommentDialogOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const user = getAuth().currentUser;

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userRef = ref(database, `users/${recipe.userId}`);
      const userSnapshot = await get(userRef);
      if (userSnapshot.exists()) {
        setUserInfo(userSnapshot.val());
      } else {
        setUserInfo({ username: 'Unknown User', profileImageUrl: '' });
      }
    };

    const checkLikeStatus = async () => {
      if (user) {
        const likes = await fetchLikes(user.uid);
        setLiked(likes.some(like => like.recipeId === recipe.id));
      }
    };

    const checkBookmarkStatus = async () => {
      if (user) {
        const bookmarks = await fetchBookmarks(user.uid);
        setBookmarked(bookmarks.includes(recipe.id));
      }
    };

    const fetchRecipeComments = async () => {
      const commentsData = await fetchComments(recipe.id);
      setComments(commentsData);
    };

    fetchUserInfo();
    checkLikeStatus();
    checkBookmarkStatus();
    fetchRecipeComments();
  }, [recipe.id, recipe.userId, user]);

  const handleLike = async () => {
    if (user) {
      if (liked) {
        const likesRef = ref(database, `likes/${user.uid}`);
        const likesSnapshot = await get(likesRef);
        const likeId = Object.keys(likesSnapshot.val() || {}).find(
          key => likesSnapshot.val()[key].recipeId === recipe.id
        );
        if (likeId) {
          await remove(ref(database, `likes/${user.uid}/${likeId}`));
          setLiked(false);
        }
      } else {
        await addLike(recipe.id, user.uid);
        setLiked(true);
      }
    }
  };

  const handleBookmark = async () => {
    if (user) {
      if (bookmarked) {

        const bookmarksRef = ref(database, `bookmarks/${user.uid}`);
        const bookmarksSnapshot = await get(bookmarksRef);
        const bookmarkId = Object.keys(bookmarksSnapshot.val() || {}).find(
          key => bookmarksSnapshot.val()[key].recipeId === recipe.id
        );
        if (bookmarkId) {
          await remove(ref(database, `bookmarks/${user.uid}/${bookmarkId}`));
          setBookmarked(false);
        }
      } else {
        await addBookmark(recipe.id, user.uid);
        setBookmarked(true);
      }
    }
  };

  const handleCommentButtonClick = () => {
    setCommentDialogOpen(true);
  };

  const handleCloseCommentDialog = () => {
    setCommentDialogOpen(false);
  };

  const addComment = async (commentText) => {
    if (user) {
      const comment = await addCommentToDb(recipe.id, user.uid, commentText);
      setComments([...comments, comment]);
    }
  };

  return (
    <div className="feed-card">
      <div className="feed-card-header">
        <div className="user-info">
          <Avatar
            src={userInfo.profileImageUrl || ''}
            alt="Profile"
            className="feed-profile-pic"
            style={{ height: '60px', width: '60px' }}
          >
            {!userInfo.profileImageUrl && userInfo.username && userInfo.username.charAt(0).toUpperCase()}
          </Avatar>
          <span className="username">{userInfo.username || 'Unknown User'}</span>
        </div>
        <Button variant="contained" className="view-button" onClick={() => onShowRecipe(recipe)}>
          View Recipe
        </Button>
      </div>
      <div className="feed-card-image">
        <img src={recipe.photoURL} alt="Recipe" />
      </div>
      <div className="feed-card-title">
        <h3>{recipe.title}</h3>
      </div>
      <div className="feed-card-actions">
        <div className="left-actions">
          {recipe.userId !== user.uid && (
            <>
              <IconButton onClick={handleLike}>
                {liked ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteBorderIcon />}
              </IconButton>
              <IconButton onClick={handleBookmark}>
                {bookmarked ? <BookmarkIcon style={{ color: 'yellow' }} /> : <BookmarkBorderIcon />}
              </IconButton>
            </>
          )}
          <IconButton onClick={handleCommentButtonClick}>
            <CommentIcon />
          </IconButton>
        </div>
      </div>
      <CommentDialog
        isOpen={isCommentDialogOpen}
        onClose={handleCloseCommentDialog}
        comments={comments}
        addComment={addComment}
      />
    </div>
  );
};

export default FeedCard;
