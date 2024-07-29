import React, { useEffect, useState } from 'react';
import { database, auth } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import MyRecipeCard from './MyRecipeCard';
import './MyRecipes.css';
import { formatDistanceToNow } from 'date-fns';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const recipesRef = ref(database, 'recipes');
      onValue(recipesRef, (snapshot) => {
        const data = snapshot.val();
        const userRecipes = [];

        for (const recipeId in data) {
          if (data[recipeId].userId === user.uid) {
            userRecipes.push({ id: recipeId, ...data[recipeId] });
          }
        }

        setRecipes(userRecipes);
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!recipes.length) {
    return <div>No recipes found.</div>;
  }

  return (
    <div className="my-recipes">
      {recipes.map((recipe) => {
        const timeAgo = formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true });
        return (
          <MyRecipeCard
            key={recipe.id}
            title={recipe.title}
            timeAgo={timeAgo}
          />
        );
      })}
    </div>
  );
};

export default MyRecipes;
