import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

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

    return () => socket.disconnect();
  }, [user]);

  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  return (
    <div className="relative">
      <button 
        className="p-2 relative"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        🔔
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
            {notifications.length}
          </span>
        )}
      </button>

      {showNotifications && notifications.length > 0 && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 z-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Notifications</h3>
            <button 
              onClick={clearNotifications}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>
          <div className="space-y-2">
            {notifications.map((notification, index) => (
              <p key={index} className="text-sm text-gray-600">
                {notification}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
