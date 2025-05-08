import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthModal from './components/AuthModal';
import Navbar from './components/Navbar';
import EmployeePage from './pages/EmployeePage';
import EmployeeList from './pages/EmployeeList';
import TaskPage from './pages/TaskPage';
import MyTasks from './pages/MyTasks';
import TaskHistory from './pages/TaskHistory';

const App = () => {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const AppContent = () => {
    if (!user) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Project Tracker</h1>
            <p className="mb-4">Please login to continue</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        
        <main className="py-6">
          <Routes>
            <Route path="/" element={<Navigate to={
              user.role === 'employee' ? '/my-tasks' : '/tasks'
            } replace />} />
            
            {/* Owner Routes */}
            {user.role === 'owner' && (
              <>
                <Route path="/employees" element={<EmployeePage />} />
                <Route path="/employee-list" element={<EmployeeList />} />
                <Route path="/tasks" element={<TaskPage />} />
              </>
            )}
            
            {/* Project Manager Routes */}
            {user.role === 'project_manager' && (
              <>
                <Route path="/tasks" element={<TaskPage />} />
                <Route path="/employee-list" element={<EmployeeList />} />
              </>
            )}
            
            {/* Employee Routes */}
            {user.role === 'employee' && (
              <>
                <Route path="/my-tasks" element={<MyTasks />} />
                <Route path="/task-history" element={<TaskHistory />} />
              </>
            )}
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    );
  };

  return (
    <Router>
      <AppContent />
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </Router>
  );
};

export default App;