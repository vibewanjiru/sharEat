import React, { useState, useEffect } from 'react';
import './RecipeList.css';
import { database } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RecipeCard from './RecipeCard';
import { formatDistanceToNow } from 'date-fns';

const RecipeList = ({ onRecipeClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    const recipesRef = ref(database, 'recipes');
    onValue(recipesRef, (snapshot) => {
      const recipesData = snapshot.val();
      if (recipesData) {
        setRecipes(Object.entries(recipesData).map(([id, recipe]) => ({ id, ...recipe })));
      }
    });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredRecipes(
        recipes.filter((recipe) =>
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredRecipes([]);
    }
  }, [searchQuery, recipes]);

  return (
    <div className="recipe-list">
      <TextField
        className="search-bar"
        variant="outlined"
        placeholder="Search recipes..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filteredRecipes.map((recipe) => {
        const timeAgo = formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true });
          return (
          <RecipeCard
            key={recipe.id}
            title={recipe.title}
            timeAgo={timeAgo}
            
            onClick={() => onRecipeClick(recipe.id)} 
          />
        )
        })}
    </div>
  );
};

export default RecipeList;

