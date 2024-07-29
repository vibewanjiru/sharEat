import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import { database, auth } from '../firebaseConfig';
import SavedCard from './SavedCard';
import './SavedRecipes.css'

const SavedRecipes = ({ onShowRecipe }) => {
  const [user] = useAuthState(auth);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      if (user) {
        const savedRef = ref(database, `bookmarks/${user.uid}`);
        const savedSnapshot = await get(savedRef);
        if (savedSnapshot.exists()) {
          const savedData = savedSnapshot.val();
          const recipeIds = Object.values(savedData).map(saved => saved.recipeId);

          const recipesData = await Promise.all(
            recipeIds.map(async (recipeId) => {
              const recipeRef = ref(database, `recipes/${recipeId}`);
              console.log(`Fetching recipe with ID: ${recipeId}`); 
              const recipeSnapshot = await get(recipeRef);
              if (recipeSnapshot.exists()) {
                const recipeData = recipeSnapshot.val();

                const userRef = ref(database, `users/${recipeData.userId}`);
                const userSnapshot = await get(userRef);
                const username = userSnapshot.exists() ? userSnapshot.val().username : 'Unknown User';

                return { id: recipeId, username, ...recipeData };
              } else {
                console.error(`Recipe with ID ${recipeId} not found`);
                return null;
              }
            })
          );

          setRecipes(recipesData.filter(recipe => recipe !== null));
        } else {
          console.log('No saved recipes found.');
        }
      } else {
        console.log('User not authenticated.');
      }
    };

    fetchSavedRecipes();
  }, [user]);

  return (
    <div className='saved-recipes'>
      {recipes.map((recipe) => (
        <SavedCard
          key={recipe.id}
          recipe={recipe}
          bookmarksCount={recipe.bookmarksCount || 0}
          onShowRecipe={() => onShowRecipe(recipe)}
        />
      ))}
    </div>
  );
};

export default SavedRecipes;
