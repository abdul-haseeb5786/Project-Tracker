import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('commentAdded', (comment) => {
      if (comment.author !== user?.userId) {
        setNotifications((prev) => [
          ...prev,
          `New comment on task: ${comment.text.slice(0, 30)}...`,
        ]);
      }
    });

    return () => socket.disconnect();
  }, [user]);

  return (
    <div className="relative">
      <button className="p-2">
        🔔{' '}
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
            {notifications.length}
          </span>
        )}
      </button>
    </div>
  );
};

export default NotificationBell;
