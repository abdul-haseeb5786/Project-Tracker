import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

const TaskForm = ({ onTaskAdded }) => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    assignedTo: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('/api/users');
      // Filter only employees (not project managers or owners)
      const employeeList = res.data.filter(emp => emp.role === 'employee');
      setEmployees(employeeList);
    } catch (err) {
      setError('Error fetching employees');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("User is not authenticated.");
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/tasks', { 
        ...formData, 
        createdBy: user._id,
        status: 'pending' // Always start as pending
      });
      
      onTaskAdded();
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: '',
        assignedTo: ''
      });
      setError(null);
    } catch (err) {
      setError('Error adding task: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg shadow-lg"
      onSubmit={handleSubmit}
    >
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
        >
          {error}
        </motion.div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-indigo-700 mb-1">
            Task Title
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            placeholder="Enter task title"
            className="w-full p-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-indigo-700 mb-1">
            Description
          </label>
          <motion.textarea
            whileFocus={{ scale: 1.01 }}
            placeholder="Enter task description"
            className="w-full p-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white h-24"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-indigo-700 mb-1">
            Priority
          </label>
          <motion.select
            whileFocus={{ scale: 1.01 }}
            className="w-full p-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </motion.select>
        </div>

        <div>
          <label className="block text-sm font-medium text-indigo-700 mb-1">
            Assign To
          </label>
          <motion.select
            whileFocus={{ scale: 1.01 }}
            className="w-full p-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            required
          >
            <option value="">Select Employee</option>
            {employees.map(employee => (
              <option key={employee._id} value={employee._id}>
                {employee.name} ({employee.email})
              </option>
            ))}
          </motion.select>
        </div>

        <div>
          <label className="block text-sm font-medium text-indigo-700 mb-1">
            Due Date
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="date"
            className="w-full p-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
            min={new Date().toISOString().split('T')[0]} // Prevent past dates
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
          disabled={loading}
        >
          <PlusCircleIcon className="h-5 w-5" />
          <span>{loading ? 'Adding Task...' : 'Add Task'}</span>
        </motion.button>
      </div>
    </motion.form>
  );
};

export default TaskForm;
