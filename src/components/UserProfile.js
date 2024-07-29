import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { database } from '../firebaseConfig';
import { ref, onValue, update } from 'firebase/database';
import { Avatar, Button } from '@mui/material';
import { auth } from '../firebaseConfig';

const UserProfile = ({ userId }) => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);

  useEffect(() => {
    if (userId) {
      const userRef = ref(database, `users/${userId}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserData({
            ...data,
            followers: data.followers || [],
            following: data.following || [],
          });
        }
      });
    }

    if (user) {
      const currentUserRef = ref(database, `users/${user.uid}`);
      onValue(currentUserRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setCurrentUserData({
            ...data,
            following: data.following || [],
          });
        }
      });
    }
  }, [userId, user]);

  const handleFollow = async () => {
    if (!user || !userData || !currentUserData) return;

    const userRef = ref(database, `users/${userId}`);
    const currentUserRef = ref(database, `users/${user.uid}`);

    const newFollowers = [...userData.followers, user.uid];
    const newFollowing = [...currentUserData.following, userId];

    await update(userRef, { followers: newFollowers });
    await update(currentUserRef, { following: newFollowing });
  };

  const handleUnfollow = async () => {
    if (!user || !userData || !currentUserData) return;

    const userRef = ref(database, `users/${userId}`);
    const currentUserRef = ref(database, `users/${user.uid}`);

    const newFollowers = userData.followers.filter((follower) => follower !== user.uid);
    const newFollowing = currentUserData.following.filter((follow) => follow !== userId);

    await update(userRef, { followers: newFollowers });
    await update(currentUserRef, { following: newFollowing });
  };

  if (!userData) return <div>Loading...</div>;

  const isFollowing = currentUserData?.following?.includes(userId);

  return (
    <div className="user-profile">
      <div
        className="image-container"
        style={{ backgroundImage: `url(${userData.bgImageUrl || '#ccc'})` }}
      />
      <div className="profile-details1">
        <Avatar
          src={userData.profileImageUrl || ''}
          alt="Profile"
          className="profile-pic1"
          sx={{ width: 80, height: 80 }}
        >
          {!userData.profileImageUrl && userData.firstName.charAt(0).toUpperCase()}
        </Avatar>
        {user && user.uid !== userId && (
            isFollowing ? (
              <Button variant="contained" className="follow-button" onClick={handleUnfollow}>
                Unfollow
              </Button>
            ) : (
              <Button variant="contained" className="follow-button" onClick={handleFollow}>
                Follow
              </Button>
            )
        )}
      </div>
      <div className="profile-info">
      <span className="full-name">{userData.firstName} {userData.lastName}</span>
          <span className="username">@{userData.username}</span>
          <div className="follow-info">
            <span className="followers">{userData.followers.length} Followers</span>
            <span className="following">{userData.following.length} Following</span>
          </div>
      </div>
    </div>
  );
};

export default UserProfile;
