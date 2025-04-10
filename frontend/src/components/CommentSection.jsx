import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const CommentSection = ({ taskId, comments }) => {
  const [newComment, setNewComment] = useState('');
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`/api/tasks/${taskId}/comments`, { text: newComment });
    setNewComment('');
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-2 border rounded-md dark:bg-gray-700"
          placeholder="Add a comment..."
        />
        <button 
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Post Comment
        </button>
      </form>
      
      {comments.map((comment) => (
        <div key={comment._id} className="p-3 mb-2 bg-gray-100 dark:bg-gray-700 rounded-md">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {comment.author.email} - {new Date(comment.createdAt).toLocaleString()}
          </p>
          <p className="mt-1">{comment.text}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;