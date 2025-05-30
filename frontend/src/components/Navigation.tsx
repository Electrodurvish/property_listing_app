import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const { isAuthenticated, userEmail, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          🏠 Property Listings
        </Link>
        
        <div style={styles.links}>
          <Link 
            to="/" 
            style={{...styles.link, ...(isActive('/') ? styles.activeLink : {})}}
          >
            Properties
          </Link>
          
          {isAuthenticated && (
            <>
              <Link 
                to="/favorites" 
                style={{...styles.link, ...(isActive('/favorites') ? styles.activeLink : {})}}
              >
                Favorites
              </Link>
              <Link 
                to="/recommendations" 
                style={{...styles.link, ...(isActive('/recommendations') ? styles.activeLink : {})}}
              >
                Recommendations
              </Link>
            </>
          )}
        </div>

        <div style={styles.auth}>
          {isAuthenticated ? (
            <div style={styles.userInfo}>
              <span style={styles.userEmail}>{userEmail}</span>
              <button onClick={logout} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          ) : (
            <div>
              <Link to="/login" style={styles.authLink}>Login</Link>
              <Link to="/register" style={styles.authLink}>Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#2c3e50',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 1rem',
  },
  logo: {
    color: '#ecf0f1',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    gap: '2rem',
  },
  link: {
    color: '#bdc3c7',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  },
  activeLink: {
    backgroundColor: '#34495e',
    color: '#ecf0f1',
  },
  auth: {
    display: 'flex',
    alignItems: 'center',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userEmail: {
    color: '#ecf0f1',
    fontSize: '0.9rem',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  authLink: {
    color: '#3498db',
    textDecoration: 'none',
    margin: '0 0.5rem',
    padding: '0.5rem 1rem',
    border: '1px solid #3498db',
    borderRadius: '4px',
    transition: 'all 0.3s',
  },
};

export default Navigation; 