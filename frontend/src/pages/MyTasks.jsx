import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/tasks');
      // Filter tasks assigned to the current user
      const myTasks = res.data.filter(task => task.assignedTo?._id === user?._id);
      setTasks(myTasks);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTask = async (taskId) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { 
        status: 'in-progress',
        accepted: true 
      });
      await fetchTasks();
      setError(null);
    } catch (err) {
      console.error('Error accepting task:', err);
      setError(err.response?.data?.error || 'Failed to accept task. Please try again.');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
      await fetchTasks();
      setError(null);
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.response?.data?.error || 'Failed to update task status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  if (loading) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center h-64"
    >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </motion.div>
  );

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto p-6"
      >
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </motion.div>
    );
  }

  if (tasks.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto p-6 text-center"
      >
        <p className="text-gray-600">No tasks assigned to you yet.</p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 text-indigo-900"
      >
        My Tasks
      </motion.h2>

      <div className="space-y-4">
        <AnimatePresence>
          {tasks.map((task, index) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-indigo-900">{task.title}</h3>
                    <div className="flex items-center space-x-2">
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className={`px-3 py-1 rounded-full text-sm ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        {task.priority} priority
                      </motion.span>
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className={`px-3 py-1 rounded-full text-sm ${getStatusColor(task.status)}`}
                      >
                        {task.status}
                      </motion.span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600">{task.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(task.status)}
                      <p className="text-sm capitalize">{task.status}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Due Date</p>
                      <p className="text-sm">{new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Assigned By</p>
                      <p className="text-sm">{task.createdBy?.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Created</p>
                      <p className="text-sm">{new Date(task.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  {task.status === 'pending' && !task.accepted && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAcceptTask(task._id)}
                      className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                      Accept Task
                    </motion.button>
                  )}
                  
                  {task.status !== 'completed' && task.accepted && (
                    <motion.select
                      whileHover={{ scale: 1.02 }}
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      className="p-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    >
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Mark as Completed</option>
                    </motion.select>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyTasks; 