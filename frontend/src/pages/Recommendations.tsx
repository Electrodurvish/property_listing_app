import React, { useEffect, useState } from 'react';
import { Recommendation, recommendationsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Recommendations: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRecommendations = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await recommendationsAPI.getRecommendations();
      setRecommendations(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadRecommendations();
    }
  }, [isAuthenticated]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📬 Property Recommendations</h1>
        <div style={styles.stats}>
          {recommendations.length} recommendation{recommendations.length !== 1 ? 's' : ''} received
        </div>
      </div>

      {error && (
        <div style={styles.error}>
          {error}
          <button onClick={loadRecommendations} style={styles.retryButton}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div style={styles.loading}>
          <div style={styles.spinner}>🔄</div>
          <p>Loading recommendations...</p>
        </div>
      ) : (
        <>
          {recommendations.length === 0 ? (
            <div style={styles.noRecommendations}>
              <h3>No recommendations yet</h3>
              <p>When other users recommend properties to you, they'll appear here!</p>
              <div style={styles.helpText}>
                <h4>How to get recommendations:</h4>
                <ul>
                  <li>Share your email with friends or real estate agents</li>
                  <li>They can recommend properties to you from the property listings</li>
                  <li>You'll see all recommendations with personal messages here</li>
                </ul>
              </div>
            </div>
          ) : (
            <div style={styles.recommendationsList}>
              {recommendations.map((recommendation) => (
                <div key={recommendation._id} style={styles.recommendationCard}>
                  <div style={styles.senderInfo}>
                    <div style={styles.senderDetails}>
                      <strong>From: {recommendation.sender.email}</strong>
                      <span style={styles.date}>{formatDate(recommendation.createdAt)}</span>
                    </div>
                  </div>

                  <div style={styles.propertyInfo}>
                    <div style={styles.propertyHeader}>
                      <h3 style={styles.propertyTitle}>{recommendation.property.title}</h3>
                      <div style={styles.propertyMeta}>
                        <span style={styles.price}>{formatPrice(recommendation.property.price)}</span>
                        <span style={styles.type}>{recommendation.property.type}</span>
                      </div>
                    </div>

                    <div style={styles.propertyDetails}>
                      <div style={styles.location}>
                        📍 {recommendation.property.city}, {recommendation.property.state}
                      </div>
                      
                      <div style={styles.features}>
                        <span>🏠 {recommendation.property.areaSqFt} sq ft</span>
                        <span>🛏️ {recommendation.property.bedrooms} beds</span>
                        <span>🚿 {recommendation.property.bathrooms} baths</span>
                      </div>

                      <div style={styles.propertyTags}>
                        <span style={styles.furnished}>{recommendation.property.furnished}</span>
                        <span style={styles.listingType}>
                          {recommendation.property.listingType.charAt(0).toUpperCase() + 
                           recommendation.property.listingType.slice(1)}
                        </span>
                        {recommendation.property.isVerified && (
                          <span style={styles.verified}>✅ Verified</span>
                        )}
                      </div>

                      {recommendation.property.amenities.length > 0 && (
                        <div style={styles.amenities}>
                          <strong>Amenities:</strong> {recommendation.property.amenities.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>

                  {recommendation.message && (
                    <div style={styles.messageSection}>
                      <h4 style={styles.messageTitle}>Personal Message:</h4>
                      <p style={styles.message}>"{recommendation.message}"</p>
                    </div>
                  )}

                  <div style={styles.actions}>
                    <a
                      href={`/?search=${encodeURIComponent(recommendation.property.title)}`}
                      style={styles.viewButton}
                    >
                      View in Listings
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div style={styles.infoBox}>
        <h4>📤 Want to recommend properties to others?</h4>
        <p>
          Browse the property listings and click the recommend button (📤) on any property card. 
          You can search for users by email and send personalized recommendations with messages.
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
  noRecommendations: {
    textAlign: 'center' as const,
    padding: '3rem',
    color: '#7f8c8d',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '2rem',
  },
  helpText: {
    textAlign: 'left' as const,
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#e8f4fd',
    borderRadius: '4px',
    color: '#2c3e50',
  },
  recommendationsList: {
    marginBottom: '2rem',
  },
  recommendationCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    border: '1px solid #e8f4fd',
  },
  senderInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #ecf0f1',
  },
  senderDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    color: '#2c3e50',
  },
  date: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
  },
  propertyInfo: {
    marginBottom: '1rem',
  },
  propertyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  propertyTitle: {
    margin: 0,
    color: '#2c3e50',
    fontSize: '1.2rem',
  },
  propertyMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  price: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#27ae60',
  },
  type: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
  },
  propertyDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  location: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
  },
  features: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.9rem',
    color: '#34495e',
  },
  propertyTags: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.8rem',
  },
  furnished: {
    backgroundColor: '#f39c12',
    color: 'white',
    padding: '0.2rem 0.5rem',
    borderRadius: '12px',
  },
  listingType: {
    backgroundColor: '#9b59b6',
    color: 'white',
    padding: '0.2rem 0.5rem',
    borderRadius: '12px',
  },
  verified: {
    color: '#27ae60',
    fontSize: '0.8rem',
  },
  amenities: {
    fontSize: '0.85rem',
    color: '#34495e',
  },
  messageSection: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  messageTitle: {
    margin: '0 0 0.5rem 0',
    color: '#2c3e50',
    fontSize: '1rem',
  },
  message: {
    margin: 0,
    fontStyle: 'italic',
    color: '#34495e',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  viewButton: {
    backgroundColor: '#3498db',
    color: 'white',
    textDecoration: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s',
  },
  infoBox: {
    backgroundColor: '#e8f4fd',
    border: '1px solid #bee5eb',
    borderRadius: '8px',
    padding: '1.5rem',
    color: '#0c5460',
  },
};

export default Recommendations; 