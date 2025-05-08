import axios from './axios';

export const fixAdminRole = async () => {
  try {
    const response = await axios.post('/api/auth/fix-admin');
    console.log('Admin role fixed:', response.data);
    return true;
  } catch (error) {
    console.error('Error fixing admin role:', error);
    return false;
  }
}; 