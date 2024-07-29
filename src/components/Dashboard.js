// src/components/Dashboard.js
import React, { useState } from 'react';
import RecipeList from './RecipeList';
import Feed from './Feed';
import CreateRecipe from './Create_Recipe';
import Navbar from './Navbar';
import ProfileCard from './ProfileCard';
import MyRecipes from './MyRecipes';
import SearchUsers from './SearchUsers';
import UserProfile from './UserProfile';
import ViewRecipe from './View_Recipe';
import LikedRecipes from './LikedRecipes'; 
import SavedRecipes from './SavedRecipes'; 
import './Dashboard.css';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import { fetchBookmarks } from '../api/bookmarkApi';
import { fetchLikes } from '../api/likesApi'; 

const Dashboard = () => {
  const [currentView, setCurrentView] = useState('main');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);

  const handleShowCreateRecipe = () => {
    setCurrentView('createRecipe');
  };

  const handleShowMainPage = () => {
    setCurrentView('main');
    setSelectedUserId(null);
  };

  const handleShowMyRecipes = () => {
    setCurrentView('myRecipes');
  };

  const handleShowLikedRecipes = async () => {
    try {
      const likes = await fetchLikes('userId'); 
      setLikedRecipes(likes);
      setCurrentView('likedRecipes');
    } catch (error) {
      console.error('Error fetching liked recipes:', error);
    }
  };

  const handleShowSavedRecipes = async () => {
    try {
      const bookmarks = await fetchBookmarks('userId'); 
      setSavedRecipes(bookmarks);
      setCurrentView('savedRecipes');
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
    }
  };

  const handleShowUserProfile = (userId) => {
    setSelectedUserId(userId);
    setCurrentView('userProfile');
  };

  const handleSearchClick = () => {
    setCurrentView('searchUsers');
  };

  const handleShowRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setCurrentView('viewRecipe');
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'createRecipe':
        return <CreateRecipe onCancel={handleShowMainPage} />;
      case 'myRecipes':
        return <MyRecipes />;
      case 'likedRecipes':
        return <LikedRecipes recipes={likedRecipes} onShowRecipe={handleShowRecipe} />;
      case 'savedRecipes':
        return <SavedRecipes recipes={savedRecipes} onShowRecipe={handleShowRecipe} />;
      case 'searchUsers':
        return <SearchUsers onUserClick={handleShowUserProfile} />;
      case 'userProfile':
        return <UserProfile userId={selectedUserId} />;
      case 'viewRecipe':
        return <ViewRecipe recipe={selectedRecipe} />;
      default:
        return <Feed onSearchClick={handleSearchClick} onShowRecipe={handleShowRecipe} />;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        <div className="recipes">
          <RecipeList />
        </div>
        <div className="main-content">
          {renderMainContent()}
        </div>
        <div className="profile-sidebar">
          <Button
            variant="contained"
            color="primary"
            className="create-button"
            startIcon={<AddIcon />}
            onClick={handleShowCreateRecipe}
            sx={{ borderRadius: '5px', margin: '10px auto', width: '80%' }}
          >
            CREATE
          </Button>
          <Button
            variant="contained"
            color="primary"
            className="home-button"
            startIcon={<HomeIcon />}
            onClick={handleShowMainPage}
            sx={{ borderRadius: '5px', margin: '20px auto', width: '80%' }}
          >
            HOME
          </Button>
          <ProfileCard 
            onShowMyRecipes={handleShowMyRecipes} 
            onShowLikedRecipes={handleShowLikedRecipes} 
            onShowSavedRecipes={handleShowSavedRecipes} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
