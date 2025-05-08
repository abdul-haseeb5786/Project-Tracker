import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { BellIcon } from '@heroicons/react/24/outline';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const socket = io('https://project-tracker-lq9w.vercel.app', {
      transports: ['websocket'],
      secure: true,
      path: '/socket.io'
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('newTask', (task) => {
      if (task.assignedTo === user?._id) {
        setNotifications((prev) => [
          ...prev,
          `New task assigned: ${task.title}`
        ]);
      }
    });

    socket.on('taskStatusChanged', (task) => {
      if (task.assignedTo === user?._id) {
        setNotifications((prev) => [
          ...prev,
          `Task status updated: ${task.title} is now ${task.status}`
        ]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  return (
    <div className="relative">
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 relative"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <BellIcon className="h-6 w-6 text-indigo-600" />
        {notifications.length > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
          >
            {notifications.length}
          </motion.span>
        )}
      </motion.button>

      {showNotifications && notifications.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 z-50"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-indigo-900">Notifications</h3>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearNotifications}
              className="text-sm text-indigo-500 hover:text-indigo-700"
            >
              Clear all
            </motion.button>
          </div>
          <div className="space-y-2">
            {notifications.map((notification, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-sm text-gray-600 p-2 bg-gray-50 rounded"
              >
                {notification}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NotificationBell;
