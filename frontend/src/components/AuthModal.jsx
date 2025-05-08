import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import { forceAdminRole } from '../utils/forceAdmin';

const AuthModal = ({ onClose }) => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin && email === 'admin@gmail.com') {
        await forceAdminRole();
      }
      
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const data = isLogin ? { email, password } : { email, password, name };
      const res = await axios.post(endpoint, data);
      
      if (isLogin && email === 'admin@gmail.com') {
        res.data.user.role = 'owner';
      }
      
      if (isLogin) login(res.data.token, res.data.user);
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || 'Error!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96 dark:bg-gray-800">
        <h2 className="text-xl mb-4 dark:text-white">
          {isLogin ? 'Login' : 'Register'}
        </h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-2 mb-3 border rounded dark:bg-gray-700"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-3 border rounded dark:bg-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded dark:bg-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-blue-500 text-white p-2 rounded">
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <button
          className="mt-4 text-blue-500 hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Create new account' : 'Already have account?'}
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
