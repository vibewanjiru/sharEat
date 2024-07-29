import React, { useState, useEffect } from 'react';
import { Avatar, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { updateUser } from '../api/authApi';
import { database } from '../firebaseConfig';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import './EditProfile.css';
import SpinnerLoader from './SpinnerLoader'; 

const EditProfile = ({ open, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [bgImage, setBgImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [bgImageUrl, setBgImageUrl] = useState('');
  const [loading, setLoading] = useState(false); 

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const userRef = ref(database, `users/${currentUser.uid}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setUserData(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setUsername(data.username);
        setEmail(data.email);
        setProfileImageUrl(data.profileImageUrl || '');
        setBgImageUrl(data.bgImageUrl || '');
      });
    }
  }, [currentUser]);

  const handleSave = async () => {
    setLoading(true); 
    const updates = {
      firstName,
      lastName,
      username,
      email,
    };

    if (profileImage) updates.profileImage = profileImage;
    if (bgImage) updates.bgImage = bgImage;

    try {
      if (Object.keys(updates).length > 0) {
        await updateUser(currentUser.uid, updates);
      }
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      
    } finally {
      setLoading(false); 
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImageUrl(URL.createObjectURL(file)); 
    }
  };

  const handleBgImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBgImage(file);
      setBgImageUrl(URL.createObjectURL(file));
    }
  };

  if (!userData) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <div className="edit-profile">
          <div className="image-container" style={{ backgroundImage: `url(${bgImageUrl || userData.bgImageUrl || '#ccc'})` }}>
          <Button 
              className="set-image-button" 
              component="label" 
              style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff' }}
            >
              Set Image
              <input type="file" accept="image/*" hidden onChange={handleBgImageChange} />
          </Button>
          </div>
          <div className="profile-details">
            <div className="avatar-container">
              <Avatar
                src={profileImageUrl || userData.profileImageUrl || ''}
                alt="Profile"
                className="profile-pic"
                style={{ height: '80px', width: '80px' }}
              >
                {!userData.profileImageUrl && userData.firstName.charAt(0).toUpperCase()}
              </Avatar>
              <Button className="add-photo-icon" component="label">
                <PhotoCameraIcon />
                <input type="file" accept="image/*" hidden onChange={handleProfileImageChange} />
              </Button>
            </div>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
      </DialogActions>
      {loading && <SpinnerLoader />} 
    </Dialog>
  );
};

export default EditProfile;
