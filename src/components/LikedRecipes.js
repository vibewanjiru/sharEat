import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import { database, auth } from '../firebaseConfig';
import LikedCard from './LikedCard';
import './LikedRecipes.css';

const LikedRecipes = ({ onShowRecipe }) => {
  const [user] = useAuthState(auth);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchLikedRecipes = async () => {
      if (user) {
        const likesRef = ref(database, `likes/${user.uid}`);
        const likesSnapshot = await get(likesRef);
        if (likesSnapshot.exists()) {
          const likesData = likesSnapshot.val();

          const recipeIds = Object.values(likesData).map(like => like.recipeId);

          const recipesData = await Promise.all(
            recipeIds.map(async (recipeId) => {
              const recipeRef = ref(database, `recipes/${recipeId}`);
              console.log(`Fetching recipe with ID: ${recipeId}`); 
              const recipeSnapshot = await get(recipeRef);
              if (recipeSnapshot.exists()) {
                return { id: recipeId, ...recipeSnapshot.val() };
              } else {
                console.error(`Recipe with ID ${recipeId} not found`);
                return null;
              }
            })
          );

          setRecipes(recipesData.filter(recipe => recipe !== null));
        } else {
          console.log('No liked recipes found.');
        }
      } else {
        console.log('User not authenticated.');
      }
    };

    fetchLikedRecipes();
  }, [user]);

  return (
    <div className='liked-recipes'>
      {recipes.map((recipe) => (
        <LikedCard
          key={recipe.id}
          recipe={recipe}
          likesCount={recipe.likes?.length || 0}
          onShowRecipe={() => onShowRecipe(recipe)}
        />
      ))}
    </div>
  );
};

export default LikedRecipes;
