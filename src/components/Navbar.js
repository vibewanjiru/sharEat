import { Avatar, Button } from '@mui/material';
import { onValue, ref } from 'firebase/database';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../firebaseConfig';
import './Navbar.css';

const Navbar = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      const userRef = ref(database, `users/${user.uid}`);
      onValue(userRef, (snapshot) => {
        setUserData(snapshot.val());
      });
    }
  }, [user]);

  const renderProfilePic = () => {
    if (userData && userData.profileImageUrl) {
      return <img src={userData.profileImageUrl} alt="Profile" className="nav-profile-pic" />;
    }
    if (userData && userData.firstName) {
      return (
        <Avatar className="nav-profile-pic">
          {userData.firstName.charAt(0).toUpperCase()}
        </Avatar>
      );
    }
    return <Avatar className="nav-profile-pic">?</Avatar>;
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/login', { replace: true });
    });
  };

  return (
    <nav className="navbar">
      <div className="logo">sharEat</div>
      <div className="nav-profile">
        {renderProfilePic()}
        <span className="username">{userData ? userData.username : 'Guest'}</span>
        {user && (
          <Button variant="outlined" color="secondary" onClick={handleLogout} className="logout-button">
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
