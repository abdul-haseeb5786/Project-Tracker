import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const EmployeePage = () => {
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
      // Generate a random password
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
      
      // Show the temporary password to the admin
      alert(`Employee added successfully!\nTemporary password: ${tempPassword}\nPlease share this with the employee.`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add employee');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Employee Management</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add Employee Form - Only visible to owners */}
      {user?.role === 'owner' && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">Add New Employee</h3>
          <form onSubmit={handleAddEmployee} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee Name
              </label>
              <input
                type="text"
                placeholder="Enter employee name"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee Email
              </label>
              <input
                type="email"
                placeholder="Enter employee email"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee Role
              </label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newEmployee.role}
                onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
              >
                <option value="employee">Employee</option>
                <option value="project_manager">Project Manager</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
            >
              Add Employee
            </button>
          </form>
        </div>
      )}

      {/* Employee List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Employee List</h3>
        <div className="space-y-4">
          {employees.map((employee) => (
            <div key={employee._id} className="flex items-center justify-between p-4 border rounded hover:bg-gray-50">
              <div>
                <p className="font-semibold text-lg">{employee.name}</p>
                <p className="text-gray-600">{employee.email}</p>
                <p className="text-sm text-gray-500 capitalize">Role: {employee.role.replace('_', ' ')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeePage; 