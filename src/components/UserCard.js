import React from 'react';
import { Avatar } from '@mui/material';
import './UserCard.css';

const UserCard = ({ profileImageUrl, username, firstName, onClick }) => {
  const renderProfilePic = () => {
    if (profileImageUrl) {
      return <img src={profileImageUrl} alt="Profile" className="user-profile-pic" />;
    }
    if (firstName) {
      return <Avatar className="user-profile-pic">{firstName.charAt(0).toUpperCase()}</Avatar>;
    }
    return <Avatar className="user-profile-pic">?</Avatar>;
  };

  return (
    <div className="user-card" onClick={onClick}>
      {renderProfilePic()}
      <span className="username">{username}</span>
    </div>
  );
};

export default UserCard;
