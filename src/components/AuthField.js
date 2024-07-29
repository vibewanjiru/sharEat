import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import './Auth.css';

const AuthField = ({ value, onChange, hintText, prefixIcon, isPass = false }) => {
  return (
    <TextField
      className="auth-field"
      variant="outlined"
      placeholder={hintText}
      type={isPass ? 'password' : 'text'}
      value={value}
      onChange={onChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            {prefixIcon}
          </InputAdornment>
        ),
      }}
      inputProps={{
        style: { color: 'white' }
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'white',
          },
          '&:hover fieldset': {
            borderColor: 'white',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'white',
          },
        },
        '& .MuiInputAdornment-root svg': {
          color: 'white',
        },
      }}
    />
  );
};

export default AuthField;
