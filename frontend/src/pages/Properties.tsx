import React, { useEffect, useState } from 'react';
import { Property, PropertyFilters as FilterType, PropertyResponse, propertiesAPI, favoritesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import PropertyFilters from '../components/PropertyFilters';
import PropertyCard from '../components/PropertyCard';

const Properties: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<FilterType>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const loadProperties = async (currentFilters: FilterType = filters) => {
    setLoading(true);
    setError('');
    
    try {
      const response: PropertyResponse = await propertiesAPI.getProperties(currentFilters);
      setProperties(response.properties);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    if (isAuthenticated) {
      try {
        const favoriteProperties = await favoritesAPI.getFavorites();
        setFavorites(favoriteProperties.map(p => p._id));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [isAuthenticated]);

  const handleFiltersChange = (newFilters: FilterType) => {
    setFilters(newFilters);
    loadProperties(newFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    loadProperties(newFilters);
  };

  const handleFavoriteToggle = () => {
    loadFavorites(); // Reload favorites after toggle
  };

  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, pagination.page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pagination.pages, startPage + maxVisiblePages - 1);

    // Previous button
    if (pagination.page > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(pagination.page - 1)}
          style={styles.pageButton}
        >
          ← Previous
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          style={{
            ...styles.pageButton,
            ...(i === pagination.page ? styles.activePageButton : {}),
          }}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (pagination.page < pagination.pages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(pagination.page + 1)}
          style={styles.pageButton}
        >
          Next →
        </button>
      );
    }

    return (
      <div style={styles.pagination}>
        {pages}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Property Listings</h1>
        <div style={styles.stats}>
          Showing {properties.length} of {pagination.total} properties
        </div>
      </div>

      <PropertyFilters onFiltersChange={handleFiltersChange} loading={loading} />

      {error && (
        <div style={styles.error}>
          {error}
          <button onClick={() => loadProperties()} style={styles.retryButton}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div style={styles.loading}>
          <div style={styles.spinner}>🔄</div>
          <p>Loading properties...</p>
        </div>
      ) : (
        <>
          {properties.length === 0 ? (
            <div style={styles.noResults}>
              <h3>No properties found</h3>
              <p>Try adjusting your search criteria or filters.</p>
            </div>
          ) : (
            <div style={styles.propertyList}>
              {properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  isFavorite={favorites.includes(property._id)}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>
          )}

          {renderPagination()}
        </>
      )}

      {/* Demo Info Box */}
      <div style={styles.demoInfo}>
        <h4>🎯 Assessment Demo Features</h4>
        <ul style={styles.featureList}>
          <li>✅ <strong>Advanced Filtering:</strong> 10+ filter attributes with search, sorting, and pagination</li>
          <li>✅ <strong>User Authentication:</strong> Register/Login with JWT protection</li>
          <li>✅ <strong>Favorites System:</strong> Add/remove properties from favorites (login required)</li>
          <li>✅ <strong>Property Recommendations:</strong> Recommend properties to other users</li>
          <li>✅ <strong>User Search:</strong> Find users by email for recommendations</li>
          <li>✅ <strong>Redis Caching:</strong> Optimized API responses with 5-minute cache</li>
          <li>✅ <strong>MongoDB Integration:</strong> 1000+ properties imported from CSV</li>
          <li>✅ <strong>TypeScript:</strong> Full type safety on frontend and backend</li>
        </ul>
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
  noResults: {
    textAlign: 'center' as const,
    padding: '3rem',
    color: '#7f8c8d',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  propertyList: {
    marginBottom: '2rem',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '2rem',
  },
  pageButton: {
    backgroundColor: '#ecf0f1',
    color: '#2c3e50',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s',
  },
  activePageButton: {
    backgroundColor: '#3498db',
    color: 'white',
  },
  demoInfo: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '1.5rem',
    marginTop: '2rem',
  },
  featureList: {
    margin: '1rem 0 0 0',
    paddingLeft: '1rem',
  },
};

export default Properties;