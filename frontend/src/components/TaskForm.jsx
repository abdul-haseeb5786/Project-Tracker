// src/components/TaskForm.jsx
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TaskForm = ({ onTaskAdded }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    dueDate: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', { ...formData, userId: user.userId });
      onTaskAdded();
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'Medium',
        dueDate: '',
      });
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md mb-8 dark:bg-gray-800"
    >
      <input
        type="text"
        placeholder="Task Title"
        className="w-full p-2 mb-4 border rounded-md dark:bg-gray-700"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <textarea
        placeholder="Description"
        className="w-full p-2 mb-4 border rounded-md h-24 dark:bg-gray-700"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />
      <select
        className="w-full p-2 mb-4 border rounded-md dark:bg-gray-700"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      >
        <option value="">Select Category</option>
        <option value="Bug">Bug</option>
        <option value="Feature">Feature</option>
        <option value="Improvement">Improvement</option>
      </select>
      <input
        type="date"
        className="w-full p-2 mb-4 border rounded-md dark:bg-gray-700"
        value={formData.dueDate}
        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded-md"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
