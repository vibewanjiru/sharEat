import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import UserCard from './UserCard';
import { database } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import './SearchUsers.css';

const SearchUsers = ({ onUserClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const usersRef = ref(database, 'users');
    onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      if (usersData) {
        setUsers(Object.entries(usersData).map(([id, user]) => ({ id, ...user })));
      }
    });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredUsers(
        users.filter((user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredUsers([]);
    }
  }, [searchQuery, users]);

  return (
    <div className="search-users-container">
      <TextField
        label="Search Users"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />
      <div className="users-list">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            profileImageUrl={user.profileImageUrl}
            username={user.username}
            firstName={user.firstName}
            onClick={() => onUserClick(user.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchUsers;
