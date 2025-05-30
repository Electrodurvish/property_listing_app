import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface User {
  _id: string;
  email: string;
}

export interface Property {
  _id: string;
  id: string;
  title: string;
  type: string;
  price: number;
  state: string;
  city: string;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  furnished: string;
  availableFrom: string;
  listedBy: string;
  tags: string[];
  colorTheme: string;
  rating: number;
  isVerified: boolean;
  listingType: string;
  createdBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  type?: string;
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: string;
  listedBy?: string;
  listingType?: string;
  amenities?: string;
  tags?: string;
  search?: string;
  isVerified?: boolean;
}

export interface PropertyResponse {
  properties: Property[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Recommendation {
  _id: string;
  property: Property;
  sender: User;
  message: string;
  createdAt: string;
}

// Authentication API
export const authAPI = {
  register: async (email: string, password: string) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// Properties API
export const propertiesAPI = {
  getProperties: async (filters: PropertyFilters = {}): Promise<PropertyResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await api.get(`/properties?${params.toString()}`);
    return response.data;
  },

  getProperty: async (id: string): Promise<Property> => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  createProperty: async (propertyData: Partial<Property>) => {
    const response = await api.post('/properties', propertyData);
    return response.data;
  },

  updateProperty: async (id: string, propertyData: Partial<Property>) => {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  deleteProperty: async (id: string) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },
};

// Favorites API
export const favoritesAPI = {
  getFavorites: async (): Promise<Property[]> => {
    const response = await api.get('/favorites');
    return response.data;
  },

  addFavorite: async (propertyId: string) => {
    const response = await api.post(`/favorites/${propertyId}`);
    return response.data;
  },

  removeFavorite: async (propertyId: string) => {
    const response = await api.delete(`/favorites/${propertyId}`);
    return response.data;
  },
};

// Recommendations API
export const recommendationsAPI = {
  getRecommendations: async (): Promise<Recommendation[]> => {
    const response = await api.get('/recommendations');
    return response.data;
  },

  recommendProperty: async (propertyId: string, email: string, message: string) => {
    const response = await api.post(`/recommendations/${propertyId}`, { email, message });
    return response.data;
  },

  searchUsers: async (email: string): Promise<User[]> => {
    const response = await api.get(`/recommendations/search-users?email=${email}`);
    return response.data;
  },
};

export default api; 