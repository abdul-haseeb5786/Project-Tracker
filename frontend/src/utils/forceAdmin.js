import axios from './axios';

export const forceAdminRole = async () => {
  try {
    const response = await axios.post('/api/users/force-admin');
    console.log('Admin role forced:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error forcing admin role:', error);
    return null;
  }
}; 