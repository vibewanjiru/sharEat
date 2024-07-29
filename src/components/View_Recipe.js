import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { database, auth } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import './View_Recipe.css';
import CommentDialog from './CommentDialog';
import { Button, IconButton, Avatar } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { fetchComments } from '../api/commentsApi';
import { fetchLikes } from '../api/likesApi';

const View_Recipe = ({ recipe }) => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [isCommentDialogOpen, setCommentDialogOpen] = useState(false);

  useEffect(() => {
    if (recipe) {
      const userRef = ref(database, `users/${recipe.userId}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setUserData({
          ...data,
          followers: data.followers || [],
          following: data.following || [],
        });
      });

      const fetchRecipeData = async () => {
        const commentsData = await fetchComments(recipe.id);
        setComments(commentsData);

        const likesData = await fetchLikes(recipe.id);
        setLikes(likesData);
      };

      fetchRecipeData();
    }

    if (user) {
      const currentUserRef = ref(database, `users/${user.uid}`);
      onValue(currentUserRef, (snapshot) => {
        const data = snapshot.val();
        setCurrentUserData({
          ...data,
          following: data.following || [],
        });
      });
    }
  }, [recipe, user]);

  const handleCommentButtonClick = () => {
    setCommentDialogOpen(true);
  };

  const handleCloseCommentDialog = () => {
    setCommentDialogOpen(false);
  };

  const handleFollow = async () => {
    if (!user || !userData || !currentUserData) return;

    const userRef = ref(database, `users/${recipe.userId}`);
    const currentUserRef = ref(database, `users/${user.uid}`);

    const newFollowers = [...userData.followers, user.uid];
    const newFollowing = [...currentUserData.following, recipe.userId];

    await update(userRef, { followers: newFollowers });
    await update(currentUserRef, { following: newFollowing });
  };

  const handleUnfollow = async () => {
    if (!user || !userData || !currentUserData) return;

    const userRef = ref(database, `users/${recipe.userId}`);
    const currentUserRef = ref(database, `users/${user.uid}`);

    const newFollowers = userData.followers.filter((follower) => follower !== user.uid);
    const newFollowing = currentUserData.following.filter((follow) => follow !== recipe.userId);

    await update(userRef, { followers: newFollowers });
    await update(currentUserRef, { following: newFollowing });
  };

  if (!recipe || !userData || !currentUserData) return null;

  const isFollowing = currentUserData.following.includes(recipe.userId);

  return (
    <div className="view-recipe">
      <h1 className="title">{recipe.title}</h1>
      <div className="author-info">
        <Avatar
          src={userData.profileImageUrl || ''}
          alt="Profile"
          className="profile-pic"
          style={{ height: '60px', width: '60px' }}
        >
          {!userData.profileImageUrl && userData.firstName.charAt(0).toUpperCase()}
        </Avatar>
        <div className="author-details">
          <div className="username">{userData.username}</div>
          <div className="additional-info">
            {user && user.uid !== recipe.userId && (
              isFollowing ? (
                <Button variant="outlined" size="small" className="follow-button" onClick={handleUnfollow}>
                  Unfollow
                </Button>
              ) : (
                <Button variant="outlined" size="small" className="follow-button" onClick={handleFollow}>
                  Follow
                </Button>
              )
            )}
            <span>1 min read</span> • <span>{Math.floor((Date.now() - new Date(recipe.createdAt)) / (1000 * 60 * 60 * 24))} days ago</span>
          </div>
        </div>
      </div>
      <div className="action-bar">
        <div className="left-actions">
          <IconButton>
            <FavoriteBorderIcon />
             • <span>{likes.length}</span>
          </IconButton>
          <IconButton onClick={handleCommentButtonClick}>
            <CommentIcon />
             • <span>{comments.length}</span>
          </IconButton>
        </div>
        <div className="right-actions">
          <IconButton>
            <BookmarkBorderIcon />
          </IconButton>
          <IconButton>
            <MoreHorizIcon />
          </IconButton>
        </div>
      </div>
      <div className="recipe-image-container">
        <img src={recipe.photoURL} alt="Recipe" className="recipe-image" />
      </div>
      <div className="recipe-content" dangerouslySetInnerHTML={{ __html: recipe.content }}></div>
      <CommentDialog
        isOpen={isCommentDialogOpen}
        onClose={handleCloseCommentDialog}
        comments={comments}
      />
    </div>
  );
};

export default View_Recipe;
