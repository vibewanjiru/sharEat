import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';
import './CommentDialog.css';

const CommentDialog = ({ isOpen, onClose, comments = [], addComment }) => {
  const [newComment, setNewComment] = useState('');
  const [commentsWithUsernames, setCommentsWithUsernames] = useState([]);

  useEffect(() => {
    if (comments && comments.length > 0) {
      const fetchUsernames = async () => {
        const commentsWithNames = await Promise.all(
          comments.map(async (comment) => {
            const userRef = ref(database, `users/${comment.userId}`);
            const snapshot = await new Promise((resolve) => onValue(userRef, resolve));
            const username = snapshot.val().username;
            return { ...comment, username };
          })
        );
        setCommentsWithUsernames(commentsWithNames);
      };

      fetchUsernames();
    }
  }, [comments]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      addComment(newComment);
      setNewComment('');
    }
  };

  return (
    <div className={`comment-dialog ${isOpen ? 'open' : ''}`}>
      <div className="comment-dialog-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Comments</h2>
        <textarea
          value={newComment}
          onChange={handleCommentChange}
          placeholder="Add your comment..."
        ></textarea>
        <button className="submit-button" onClick={handleCommentSubmit}>Submit</button>
        <div className="comments-section">
          {commentsWithUsernames.map((comment, index) => (
            <div key={index} className="comment">
              <strong>{comment.username}:</strong> {comment.comment}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentDialog;
