import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import DarkModeToggle from './components/DarkModeToggle';
import NotificationBell from './components/NotificationBell';
import AuthModal from './components/AuthModal';

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className={`min-h-screen ${darkMode ? 'dark:bg-gray-900' : ''}`}>
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold dark:text-white">Project Tracker</h1>
              <div className="flex gap-4 items-center">
                <NotificationBell />
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
                >
                  Login
                </button>
                <DarkModeToggle
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                />
              </div>
            </div>

            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <TaskForm />
                    <TaskList />
                  </>
                }
              />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;