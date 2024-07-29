import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Link, Snackbar, Alert } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import AuthField from './AuthField';
import './Auth.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import SpinnerLoader from './SpinnerLoader'; 

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false); 

  const handleLogin = async () => {
    setLoading(true); 
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSnackbar({ open: true, message: 'Login successful!', severity: 'success' });
      navigate('/dashboard');
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
        <h2>Sign In to Continue</h2>
        <div className="auth-form">
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
        <Button variant="contained" color="primary" className="auth-button" onClick={handleLogin}>
          Sign In
        </Button>
        <p className="auth-switch">
          Don't have an account?{' '}
          <Link component="button" variant="body2" onClick={() => navigate('/signup')}>
            Sign up
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

export default Login;
