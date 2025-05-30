import React, { useState } from 'react';
import { Property, recommendationsAPI, User } from '../services/api';

interface RecommendModalProps {
  property: Property;
  onClose: () => void;
}

const RecommendModal: React.FC<RecommendModalProps> = ({ property, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleEmailChange = async (value: string) => {
    setEmail(value);
    if (value.length > 2) {
      setLoading(true);
      try {
        const users = await recommendationsAPI.searchUsers(value);
        setSearchResults(users);
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const selectUser = (user: User) => {
    setEmail(user.email);
    setSearchResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await recommendationsAPI.recommendProperty(property._id, email, message);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send recommendation');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div style={styles.success}>
            <h3>✅ Recommendation Sent!</h3>
            <p>Your recommendation has been sent successfully.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3>Recommend Property</h3>
          <button onClick={onClose} style={styles.closeButton}>
            ✕
          </button>
        </div>

        <div style={styles.propertyInfo}>
          <h4>{property.title}</h4>
          <p>{property.city}, {property.state} - ₹{property.price.toLocaleString()}</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Send to (Email):</label>
            <div style={styles.searchContainer}>
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                required
                style={styles.input}
                placeholder="Enter user email"
              />
              {loading && <div style={styles.loading}>Searching...</div>}
              {searchResults.length > 0 && (
                <div style={styles.searchResults}>
                  {searchResults.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => selectUser(user)}
                      style={styles.searchResult}
                    >
                      {user.email}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Message (optional):</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={styles.textarea}
              placeholder="Add a personal message..."
              rows={3}
            />
          </div>

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} style={styles.submitButton}>
              {submitting ? 'Sending...' : 'Send Recommendation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #ecf0f1',
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: '#7f8c8d',
  },
  propertyInfo: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  error: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '0.75rem',
    borderRadius: '4px',
  },
  success: {
    textAlign: 'center' as const,
    color: '#27ae60',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  label: {
    marginBottom: '0.5rem',
    color: '#34495e',
    fontWeight: 'bold',
  },
  searchContainer: {
    position: 'relative' as const,
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #bdc3c7',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #bdc3c7',
    borderRadius: '4px',
    fontSize: '1rem',
    resize: 'vertical' as const,
  },
  loading: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#f8f9fa',
    padding: '0.5rem',
    fontSize: '0.9rem',
    color: '#7f8c8d',
  },
  searchResults: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    border: '1px solid #bdc3c7',
    borderTop: 'none',
    borderRadius: '0 0 4px 4px',
    maxHeight: '150px',
    overflow: 'auto',
    zIndex: 10,
  },
  searchResult: {
    padding: '0.75rem',
    cursor: 'pointer',
    borderBottom: '1px solid #ecf0f1',
    fontSize: '0.9rem',
    backgroundColor: 'white',
    transition: 'background-color 0.2s',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '1rem',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  submitButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default RecommendModal; 