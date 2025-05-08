import { useState } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useAuth } from '../context/AuthContext';

const TaskPage = () => {
  const [refreshTasks, setRefreshTasks] = useState(false);
  const { user } = useAuth();

  const handleTaskAdded = () => {
    setRefreshTasks(prev => !prev);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Task Management</h2>
      
      {/* Only show task form to owners and project managers */}
      {(user?.role === 'owner' || user?.role === 'project_manager') && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Create New Task</h3>
          <TaskForm onTaskAdded={handleTaskAdded} />
        </div>
      )}
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Task List</h3>
        <TaskList key={refreshTasks} />
      </div>
    </div>
  );
};

export default TaskPage; 