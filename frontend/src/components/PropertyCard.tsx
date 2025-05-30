import React, { useState } from 'react';
import { Property } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { favoritesAPI } from '../services/api';
import RecommendModal from './RecommendModal';

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  isFavorite = false, 
  onFavoriteToggle 
}) => {
  const { isAuthenticated } = useAuth();
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      if (isFavorite) {
        await favoritesAPI.removeFavorite(property._id);
      } else {
        await favoritesAPI.addFavorite(property._id);
      }
      onFavoriteToggle?.();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <div style={styles.card}>
        <div style={styles.header}>
          <h3 style={styles.title}>{property.title}</h3>
          <div style={styles.actions}>
            {isAuthenticated && (
              <>
                <button
                  onClick={handleFavoriteClick}
                  disabled={loading}
                  style={{
                    ...styles.actionButton,
                    ...(isFavorite ? styles.favoriteActive : {}),
                  }}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {loading ? '...' : isFavorite ? '❤️' : '🤍'}
                </button>
                <button
                  onClick={() => setIsRecommendModalOpen(true)}
                  style={styles.actionButton}
                  title="Recommend to someone"
                >
                  📤
                </button>
              </>
            )}
          </div>
        </div>

        <div style={styles.details}>
          <div style={styles.priceType}>
            <span style={styles.price}>{formatPrice(property.price)}</span>
            <span style={styles.type}>{property.type}</span>
          </div>
          
          <div style={styles.location}>
            📍 {property.city}, {property.state}
          </div>
          
          <div style={styles.features}>
            <span>🏠 {property.areaSqFt} sq ft</span>
            <span>🛏️ {property.bedrooms} beds</span>
            <span>🚿 {property.bathrooms} baths</span>
          </div>
          
          <div style={styles.meta}>
            <span style={styles.furnished}>{property.furnished}</span>
            <span style={styles.listingType}>{property.listingType}</span>
            {property.isVerified && <span style={styles.verified}>✅ Verified</span>}
          </div>
          
          {property.amenities.length > 0 && (
            <div style={styles.amenities}>
              <strong>Amenities:</strong> {property.amenities.join(', ')}
            </div>
          )}
          
          {property.tags.length > 0 && (
            <div style={styles.tags}>
              {property.tags.map((tag, index) => (
                <span key={index} style={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div style={styles.footer}>
            <span>Listed by: {property.listedBy}</span>
            <span>Available: {formatDate(property.availableFrom)}</span>
            <span>Rating: {'⭐'.repeat(Math.floor(property.rating))}</span>
          </div>
        </div>
      </div>

      {isRecommendModalOpen && (
        <RecommendModal
          property={property}
          onClose={() => setIsRecommendModalOpen(false)}
        />
      )}
    </>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '1.5rem',
    marginBottom: '1rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  title: {
    margin: 0,
    color: '#2c3e50',
    fontSize: '1.2rem',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  actionButton: {
    backgroundColor: 'transparent',
    border: '1px solid #bdc3c7',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
  },
  favoriteActive: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  details: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  priceType: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: '1.5rem',
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
  meta: {
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
    textTransform: 'capitalize' as const,
  },
  verified: {
    color: '#27ae60',
    fontSize: '0.8rem',
  },
  amenities: {
    fontSize: '0.85rem',
    color: '#34495e',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
  },
  tag: {
    backgroundColor: '#ecf0f1',
    color: '#2c3e50',
    padding: '0.2rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: '#7f8c8d',
    marginTop: '0.5rem',
    paddingTop: '0.5rem',
    borderTop: '1px solid #ecf0f1',
  },
};

export default PropertyCard; 