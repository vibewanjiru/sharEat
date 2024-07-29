import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';
import FeedCard from './FeedCard';
import SpinnerLoader from './SpinnerLoader';
import './Feed.css';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Feed = ({ onSearchClick, onShowRecipe  }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingListData, setFollowingListData] = useState([]);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const userRef = ref(database, `users/${currentUser.uid}/following`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        const followingList = data ? Object.values(data) : []; 
        console.log('Following list data:', followingList); 
        setFollowingListData(followingList);

        const recipesRef = ref(database, 'recipes');
        onValue(recipesRef, (recipesSnapshot) => {
          const recipesData = recipesSnapshot.val();
          const userRecipes = [];
          for (const recipeId in recipesData) {
            const recipe = recipesData[recipeId];
            if (followingList.includes(recipe.userId)) {
              userRecipes.push({ id: recipeId, ...recipe });
            }
          }
          console.log('User recipes:', userRecipes); 
          setRecipes(userRecipes);
          setLoading(false);
        });
      });
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) {
    return <SpinnerLoader />;
  }

  return (
    <div className="feed">
      <div className="feed-header">
        <IconButton className="search-button" onClick={onSearchClick}>
          <SearchIcon fontSize="large" />
        </IconButton>
      </div>
      <div className="feed-content">
        {followingListData.length === 0 ? (
          <div className="no-following">Look for someone inspiring</div>
        ) : (
          recipes.map((recipe) => (
            <FeedCard
              key={recipe.id}
              recipe={recipe}
              user={null}
              onShowRecipe={onShowRecipe}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
