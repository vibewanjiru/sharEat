import React, { useEffect, useState } from 'react';
import './ProfileCard.css';
import { Avatar, Button } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, database } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import EditProfile from './EditProfile';

const ProfileCard = ({ onShowMyRecipes, onShowLikedRecipes, onShowSavedRecipes }) => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const userRef = ref(database, `users/${user.uid}`);
      onValue(userRef, (snapshot) => {
        setUserData(snapshot.val());
      });
    }
  }, [user]);

  if (!userData) return null;

  const handleEditProfile = () => {
    setEditProfileOpen(true);
  };

  const handleCloseEditProfile = () => {
    setEditProfileOpen(false);
  };

  return (
    <div className="profile-card">
      <div
        className="image-container"
        style={{ backgroundImage: userData.bgImageUrl ? `url(${userData.bgImageUrl})` : '#ccc' }}
      >
        <Avatar
          src={userData.profileImageUrl || ''}
          alt="Profile"
          className="prof-pic"
          style={{ height: '60px', width: '60px' }}
        >
          {!userData.profileImageUrl && userData.firstName.charAt(0).toUpperCase()}
        </Avatar>
      </div>
      <div className="profile-info">
        <span className="full-name">{userData.firstName} {userData.lastName}</span>
        <span className="username">@{userData.username}</span>
        <div className="follow-info">
          <span className="followers">{userData.followers ? userData.followers.length : 0} Followers</span>
          <span className="following">{userData.following ? userData.following.length : 0} Following</span>
        </div>
      </div>
      <div className="profile-action-buttons">
        <Button variant="contained" color="primary" className="action-buttons" onClick={handleEditProfile}>
          Edit Profile
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          className="action-buttons"
          onClick={onShowMyRecipes}
        >
          My Recipes
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          className="action-buttons"
          onClick={onShowLikedRecipes}
        >
          Liked Recipes
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          className="action-buttons"
          onClick={onShowSavedRecipes}
        >
          Saved Recipes
        </Button>
      </div>
      <EditProfile open={editProfileOpen} onClose={handleCloseEditProfile} />
    </div>
  );
};

export default ProfileCard;
