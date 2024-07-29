import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Link, Snackbar, Alert } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import AuthField from './AuthField';
import './Auth.css';
import { register } from '../api/authApi';
import SpinnerLoader from './SpinnerLoader'; 

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false); 

  const handleSignUp = async () => {
    setLoading(true); 
    try {
      await register(email, password, firstName, lastName, username);
      setSnackbar({ open: true, message: 'Sign up successful!', severity: 'success' });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-sidebar" />
      <div className="auth-main">
        <h2>Create a New Account</h2>
        <div className="auth-form">
          <AuthField
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            hintText="First Name"
            prefixIcon={<PersonIcon />}
          />
          <AuthField
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            hintText="Last Name"
            prefixIcon={<PersonIcon />}
          />
          <AuthField
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            hintText="Username"
            prefixIcon={<PersonIcon />}
          />
          <AuthField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            hintText="Email Address"
            prefixIcon={<EmailIcon />}
          />
          <AuthField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            hintText="Password"
            prefixIcon={<LockIcon />}
            isPass
          />
        </div>
        <Button variant="contained" color="primary" className="auth-button" onClick={handleSignUp}>
          Sign Up
        </Button>
        <p className="auth-switch">
          Have an account?{' '}
          <Link component="button" variant="body2" onClick={() => navigate('/login', { replace: true })}>
            Login
          </Link>
        </p>
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
        {loading && <SpinnerLoader />} 
      </div>
    </div>
  );
};

export default SignUp;
