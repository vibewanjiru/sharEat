import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Create_Recipe.css';
import { Button } from '@mui/material';
import { createRecipe } from '../api/recipeApi';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Create_Recipe = ({ onCancel }) => {
  const [title, setTitle] = useState('');
  const [editorState, setEditorState] = useState('');
  const [photo, setPhoto] = useState(null);
  const [user, setUser] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  const handleEditorChange = (value) => {
    setEditorState(value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handlePhotoChange = (event) => {
    if (event.target.files.length > 0) {
      setPhoto(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!photo) {
        alert("Please upload a photo");
        return;
      }

      if (!user) {
        alert("User is not authenticated");
        return;
      }

      const newRecipe = await createRecipe(title, editorState, user.uid, photo);
      console.log('Recipe Created:', newRecipe);
      setTitle('');
      setEditorState('');
      setPhoto(null);
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert(error.message);
    }
  };

  return (
    <div className="create-recipe">
      <div className="form-group">
        <input type="text" id="title" name="title" placeholder="Title" className="title-input" value={title} onChange={handleTitleChange}/>
      </div>
      <ReactQuill
        value={editorState}
        onChange={handleEditorChange}
        placeholder="Tell your story..."
        className="story-editor"
      />
      <div className="form-group">
        <input type="file" accept="image/*" onChange={handlePhotoChange} />
      </div>
      <Button variant="contained" color="primary" className="create-recipe-button" onClick={handleSubmit}>
        Create Recipe
      </Button>
    </div>
  );
};

export default Create_Recipe;
