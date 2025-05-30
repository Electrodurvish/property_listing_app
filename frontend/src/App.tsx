import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Properties from './pages/Properties';
import Favorites from './pages/Favorites';
import Recommendations from './pages/Recommendations';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={styles.app}>
          <Navigation />
          <main style={styles.main}>
            <Routes>
              <Route path="/" element={<Properties />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  main: {
    minHeight: 'calc(100vh - 70px)', // Assuming nav height is ~70px
  },
};

export default App;
