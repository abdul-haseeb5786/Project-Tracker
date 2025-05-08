import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlusIcon, UserGroupIcon, TrashIcon } from '@heroicons/react/24/outline';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    role: 'employee'
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('/api/users');
      setEmployees(res.data);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const tempPassword = Math.random().toString(36).slice(-8);
      
      await axios.post('/api/users', {
        ...newEmployee,
        password: tempPassword
      });
      
      setNewEmployee({
        name: '',
        email: '',
        role: 'employee'
      });
      
      fetchEmployees();
      setError(null);
      
      alert(`Employee added successfully!\nTemporary password: ${tempPassword}\nPlease share this with the employee.`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add employee');
    }
  };

  const handleRoleChange = async (employeeId, newRole) => {
    try {
      await axios.put(`/api/users/${employeeId}/role`, { role: newRole });
      fetchEmployees();
      setError(null);
    } catch (err) {
      setError('Failed to update role');
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      await axios.delete(`/api/users/${employeeId}`);
      fetchEmployees();
      setError(null);
    } catch (err) {
      setError('Failed to delete employee');
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 text-indigo-900"
      >
        Employee Management
      </motion.h2>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
        >
          {error}
        </motion.div>
      )}

      {/* Add Employee Form */}
      {user?.role === 'owner' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg shadow-lg mb-8"
        >
          <h3 className="text-xl font-semibold mb-4 text-indigo-900">Add New Employee</h3>
          <form onSubmit={handleAddEmployee} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-1">
                Employee Name
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                placeholder="Enter employee name"
                className="w-full p-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-1">
                Employee Email
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="email"
                placeholder="Enter employee email"
                className="w-full p-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-1">
                Employee Role
              </label>
              <motion.select
                whileFocus={{ scale: 1.01 }}
                className="w-full p-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                value={newEmployee.role}
                onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
              >
                <option value="employee">Employee</option>
                <option value="project_manager">Project Manager</option>
              </motion.select>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <UserPlusIcon className="h-5 w-5" />
              <span>Add Employee</span>
            </motion.button>
          </form>
        </motion.div>
      )}

      {/* Employee List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg shadow-lg"
      >
        <h3 className="text-xl font-semibold mb-4 text-indigo-900">Employee List</h3>
        <div className="space-y-4">
          <AnimatePresence>
            {employees.map((employee, index) => (
              <motion.div
                key={employee._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <UserGroupIcon className="h-8 w-8 text-indigo-500" />
                  <div>
                    <p className="font-semibold text-indigo-900">{employee.name}</p>
                    <p className="text-gray-600">{employee.email}</p>
                    <p className="text-sm text-indigo-500 capitalize">Role: {employee.role.replace('_', ' ')}</p>
                  </div>
                </div>
                {(user?.role === 'owner' || user?.role === 'project_manager') && (
                  <div className="flex items-center space-x-4">
                    <motion.select
                      whileHover={{ scale: 1.02 }}
                      value={employee.role}
                      onChange={(e) => handleRoleChange(employee._id, e.target.value)}
                      className="p-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    >
                      <option value="employee">Employee</option>
                      {user?.role === 'owner' && <option value="project_manager">Project Manager</option>}
                    </motion.select>
                    {user?.role === 'owner' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteEmployee(employee._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </motion.button>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default EmployeeManagement; 