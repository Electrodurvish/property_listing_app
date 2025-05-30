import React, { useEffect, useState } from 'react';
import { Property, favoritesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import PropertyCard from '../components/PropertyCard';
import { Navigate } from 'react-router-dom';

const Favorites: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFavorites = async () => {
    setLoading(true);
    setError('');
    
    try {
      const favoriteProperties = await favoritesAPI.getFavorites();
      setFavorites(favoriteProperties);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  const handleFavoriteToggle = () => {
    loadFavorites(); // Reload favorites after toggle
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>❤️ My Favorites</h1>
        <div style={styles.stats}>
          {favorites.length} favorite {favorites.length === 1 ? 'property' : 'properties'}
        </div>
      </div>

      {error && (
        <div style={styles.error}>
          {error}
          <button onClick={loadFavorites} style={styles.retryButton}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div style={styles.loading}>
          <div style={styles.spinner}>🔄</div>
          <p>Loading your favorites...</p>
        </div>
      ) : (
        <>
          {favorites.length === 0 ? (
            <div style={styles.noFavorites}>
              <h3>No favorites yet</h3>
              <p>Start exploring properties and add some to your favorites!</p>
              <a href="/" style={styles.browseLink}>
                Browse Properties
              </a>
            </div>
          ) : (
            <div style={styles.favoritesList}>
              {favorites.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  isFavorite={true}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>
          )}
        </>
      )}

      <div style={styles.infoBox}>
        <h4>💡 About Favorites</h4>
        <p>
          Your favorite properties are saved to your account and synced across all your devices. 
          You can easily remove properties from favorites by clicking the heart icon.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    color: '#2c3e50',
    margin: 0,
  },
  stats: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
  },
  error: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '1px solid white',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '3rem',
    color: '#3498db',
  },
  spinner: {
    fontSize: '2rem',
    animation: 'spin 1s linear infinite',
  },
  noFavorites: {
    textAlign: 'center' as const,
    padding: '3rem',
    color: '#7f8c8d',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '2rem',
  },
  browseLink: {
    display: 'inline-block',
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3498db',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  favoritesList: {
    marginBottom: '2rem',
  },
  infoBox: {
    backgroundColor: '#e8f4fd',
    border: '1px solid #bee5eb',
    borderRadius: '8px',
    padding: '1.5rem',
    color: '#0c5460',
  },
};

export default Favorites; 