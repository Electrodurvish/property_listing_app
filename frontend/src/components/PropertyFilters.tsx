import React, { useState } from 'react';
import { PropertyFilters as FilterType } from '../services/api';

interface PropertyFiltersProps {
  onFiltersChange: (filters: FilterType) => void;
  loading?: boolean;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({ onFiltersChange, loading = false }) => {
  const [filters, setFilters] = useState<FilterType>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof FilterType, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 }; // Reset to page 1 when filters change
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterType = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const propertyTypes = ['Villa', 'Apartment', 'Bungalow', 'Studio', 'Penthouse'];
  const furnishedOptions = ['Furnished', 'Unfurnished', 'Semi'];
  const listedByOptions = ['Owner', 'Agent', 'Builder'];
  const listingTypes = ['rent', 'sale'];
  const sortOptions = [
    { value: 'createdAt', label: 'Date Added' },
    { value: 'price', label: 'Price' },
    { value: 'areaSqFt', label: 'Area' },
    { value: 'rating', label: 'Rating' },
    { value: 'title', label: 'Title' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>🔍 Property Filters</h3>
        <div style={styles.headerActions}>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={styles.toggleButton}
          >
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
          <button onClick={clearFilters} style={styles.clearButton}>
            Clear All
          </button>
        </div>
      </div>

      {/* Basic Filters */}
      <div style={styles.filterSection}>
        <div style={styles.filterRow}>
          <div style={styles.filterGroup}>
            <label style={styles.label}>Search:</label>
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search properties..."
              style={styles.input}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>Property Type:</label>
            <select
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              style={styles.select}
            >
              <option value="">All Types</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>Listing Type:</label>
            <select
              value={filters.listingType || ''}
              onChange={(e) => handleFilterChange('listingType', e.target.value)}
              style={styles.select}
            >
              <option value="">All</option>
              {listingTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.filterRow}>
          <div style={styles.filterGroup}>
            <label style={styles.label}>City:</label>
            <input
              type="text"
              value={filters.city || ''}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              placeholder="Enter city"
              style={styles.input}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>State:</label>
            <input
              type="text"
              value={filters.state || ''}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              placeholder="Enter state"
              style={styles.input}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={filters.isVerified || false}
                onChange={(e) => handleFilterChange('isVerified', e.target.checked)}
                style={styles.checkbox}
              />
              Verified Only
            </label>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div style={styles.advancedSection}>
          <h4 style={styles.sectionTitle}>Advanced Filters</h4>
          
          <div style={styles.filterRow}>
            <div style={styles.filterGroup}>
              <label style={styles.label}>Min Price (₹):</label>
              <input
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0"
                style={styles.input}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>Max Price (₹):</label>
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="No limit"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.filterRow}>
            <div style={styles.filterGroup}>
              <label style={styles.label}>Min Area (sq ft):</label>
              <input
                type="number"
                value={filters.minArea || ''}
                onChange={(e) => handleFilterChange('minArea', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0"
                style={styles.input}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>Max Area (sq ft):</label>
              <input
                type="number"
                value={filters.maxArea || ''}
                onChange={(e) => handleFilterChange('maxArea', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="No limit"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.filterRow}>
            <div style={styles.filterGroup}>
              <label style={styles.label}>Bedrooms:</label>
              <select
                value={filters.bedrooms || ''}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
                style={styles.select}
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>Bathrooms:</label>
              <select
                value={filters.bathrooms || ''}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value ? Number(e.target.value) : undefined)}
                style={styles.select}
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>Furnished:</label>
              <select
                value={filters.furnished || ''}
                onChange={(e) => handleFilterChange('furnished', e.target.value)}
                style={styles.select}
              >
                <option value="">Any</option>
                {furnishedOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.filterRow}>
            <div style={styles.filterGroup}>
              <label style={styles.label}>Listed By:</label>
              <select
                value={filters.listedBy || ''}
                onChange={(e) => handleFilterChange('listedBy', e.target.value)}
                style={styles.select}
              >
                <option value="">Any</option>
                {listedByOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>Amenities:</label>
              <input
                type="text"
                value={filters.amenities || ''}
                onChange={(e) => handleFilterChange('amenities', e.target.value)}
                placeholder="pool,gym,parking"
                style={styles.input}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>Tags:</label>
              <input
                type="text"
                value={filters.tags || ''}
                onChange={(e) => handleFilterChange('tags', e.target.value)}
                placeholder="luxury,spacious"
                style={styles.input}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sorting and Pagination */}
      <div style={styles.sortSection}>
        <div style={styles.filterRow}>
          <div style={styles.filterGroup}>
            <label style={styles.label}>Sort By:</label>
            <select
              value={filters.sortBy || 'createdAt'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              style={styles.select}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>Order:</label>
            <select
              value={filters.sortOrder || 'desc'}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
              style={styles.select}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>Per Page:</label>
            <select
              value={filters.limit || 10}
              onChange={(e) => handleFilterChange('limit', Number(e.target.value))}
              style={styles.select}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div style={styles.loading}>
          🔄 Loading properties...
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #ecf0f1',
  },
  title: {
    margin: 0,
    color: '#2c3e50',
  },
  headerActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  toggleButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  clearButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  filterSection: {
    marginBottom: '1rem',
  },
  advancedSection: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  sortSection: {
    paddingTop: '1rem',
    borderTop: '1px solid #ecf0f1',
  },
  sectionTitle: {
    margin: '0 0 1rem 0',
    color: '#34495e',
    fontSize: '1rem',
  },
  filterRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    flexWrap: 'wrap' as const,
  },
  filterGroup: {
    flex: 1,
    minWidth: '200px',
  },
  label: {
    display: 'block',
    marginBottom: '0.25rem',
    color: '#34495e',
    fontSize: '0.9rem',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #bdc3c7',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  select: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #bdc3c7',
    borderRadius: '4px',
    fontSize: '0.9rem',
    backgroundColor: 'white',
  },
  checkbox: {
    marginRight: '0.5rem',
  },
  loading: {
    textAlign: 'center' as const,
    color: '#3498db',
    fontStyle: 'italic',
    paddingTop: '1rem',
  },
};

export default PropertyFilters; 