import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error.response?.data?.error || error.message);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Error updating status:', error.response?.data?.error || error.message);
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

  if (loading) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center h-64"
    >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </motion.div>
  );

  // Filter tasks based on user role
  const filteredTasks = tasks.filter(task => {
    if (user?.role === 'owner' || user?.role === 'project_manager') return true;
    return task.assignedTo?._id === user?._id;
  });

  if (filteredTasks.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <p className="text-gray-600">No tasks found</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {filteredTasks.map((task, index) => (
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
                  <h3 className="text-xl font-bold">{task.title}</h3>
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
                    <p className="text-sm font-medium text-gray-500">Assigned To</p>
                    <p className="text-sm">{task.assignedTo?.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created By</p>
                    <p className="text-sm">{task.createdBy?.name}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 ml-4">
                {user?.role === 'owner' && (
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(task._id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Delete
                  </motion.button>
                )}
                
                {task.assignedTo?._id === user?._id && (
                  <motion.select
                    whileHover={{ scale: 1.02 }}
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className="p-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </motion.select>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;
