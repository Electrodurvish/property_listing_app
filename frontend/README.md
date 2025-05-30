# Property Listing System - Frontend

A modern React TypeScript frontend application that showcases all the backend assessment requirements with a clean, user-friendly interface.

## 🚀 Features Implemented

### Core Assessment Requirements ✅
1. **Advanced Property Filtering** - 10+ filter attributes with real-time search
2. **User Authentication** - JWT-based login/register with protected routes
3. **Favorites Management** - Add/remove properties from personal favorites
4. **Property Recommendations** - Send property recommendations to other users
5. **User Search** - Find users by email for recommendations
6. **Responsive Design** - Mobile-friendly interface

### UI/UX Features ✅
- **Modern Design** - Clean, professional interface with intuitive navigation
- **Real-time Updates** - Immediate feedback on user actions
- **Loading States** - Smooth loading indicators and error handling
- **Pagination** - Efficient browsing of large property datasets
- **Search & Sort** - Multiple sorting options and text search
- **Accessibility** - Keyboard navigation and screen reader support

## 🛠 Tech Stack

- **React 18** with TypeScript
- **React Router** for client-side routing
- **Axios** for API communication
- **Custom Hooks** for state management
- **CSS-in-JS** with inline styles for component isolation
- **Responsive Design** with mobile-first approach

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on http://localhost:5000

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
```

## 🗂 Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Navigation.tsx       # Main navigation bar
│   │   ├── Login.tsx           # Login form
│   │   ├── Register.tsx        # Registration form
│   │   ├── PropertyCard.tsx    # Individual property display
│   │   ├── PropertyFilters.tsx # Advanced filtering component
│   │   └── RecommendModal.tsx  # Property recommendation modal
│   ├── contexts/
│   │   └── AuthContext.tsx     # Authentication state management
│   ├── pages/
│   │   ├── Properties.tsx      # Main property listings page
│   │   ├── Favorites.tsx       # User favorites page
│   │   └── Recommendations.tsx # Received recommendations page
│   ├── services/
│   │   └── api.ts             # API service layer
│   ├── App.tsx                # Main application component
│   ├── index.tsx              # Application entry point
│   └── index.css              # Global styles
└── package.json
```

## 🎯 Key Components

### Navigation Component
- Dynamic navigation based on authentication state
- Active route highlighting
- User profile display with logout functionality

### PropertyFilters Component
- 10+ filter attributes (type, city, price, area, bedrooms, etc.)
- Basic and advanced filter modes
- Real-time search with debouncing
- Sorting and pagination controls

### PropertyCard Component
- Comprehensive property information display
- Favorite toggle functionality (for authenticated users)
- Recommendation modal trigger
- Responsive design with hover effects

### Authentication System
- JWT token management
- Protected route handling
- Automatic login state persistence
- Error handling and validation

## 🔄 API Integration

All API calls are centralized in `src/services/api.ts`:

- **Authentication**: Login, register, logout
- **Properties**: CRUD operations with advanced filtering
- **Favorites**: Add, remove, list favorites
- **Recommendations**: Send and receive property recommendations
- **User Search**: Find users by email

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Desktop**: > 768px - Full layout with sidebar filters
- **Tablet**: 768px - Stacked layout with collapsible filters
- **Mobile**: < 768px - Single column with drawer navigation

## 🎨 Design System

### Color Palette
- **Primary**: #3498db (Blue)
- **Success**: #27ae60 (Green)
- **Warning**: #f39c12 (Orange)
- **Danger**: #e74c3c (Red)
- **Dark**: #2c3e50
- **Light**: #ecf0f1

### Typography
- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI)
- **Headers**: Bold, #2c3e50
- **Body**: Regular, #34495e
- **Muted**: #7f8c8d

## 🔒 Security Features

- **JWT Token Management** - Secure token storage and automatic injection
- **Protected Routes** - Authentication required for sensitive pages
- **Input Validation** - Client-side validation for all forms
- **XSS Prevention** - React's built-in XSS protection
- **CORS Handling** - Proper cross-origin request handling

## 🚀 Performance Features

- **Code Splitting** - Lazy loading of route components
- **Debounced Search** - Reduced API calls for search inputs
- **Memoization** - React.memo for expensive components
- **Virtual Scrolling** - Efficient rendering of large lists
- **Optimized Images** - Responsive image loading

## 🧪 Demo Features

The application includes several demo-specific features to showcase backend capabilities:

1. **Assessment Info Boxes** - Highlighting completed requirements
2. **Feature Indicators** - Visual markers for implemented features
3. **Loading States** - Demonstrating API interactions
4. **Error Handling** - Showing robust error management
5. **User Guidance** - Tooltips and help text for new users

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### API Configuration
The API base URL is configured in `src/services/api.ts`. Update if backend runs on different port:
```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

## 🤝 Usage Guide

### For New Users:
1. **Register** an account or use the demo credentials
2. **Browse Properties** using the advanced filters
3. **Add Favorites** by clicking the heart icon (requires login)
4. **Recommend Properties** to other users via the share button

### For Existing Users:
1. **Login** with your credentials
2. **View Favorites** in the dedicated section
3. **Check Recommendations** received from other users
4. **Search Users** by email when recommending properties

## 🐛 Troubleshooting

### Common Issues:

1. **API Connection Error**
   - Ensure backend server is running on port 5000
   - Check CORS configuration in backend

2. **Authentication Issues**
   - Clear localStorage and refresh the page
   - Check JWT token expiration

3. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check TypeScript compilation: `npm run build`

4. **Performance Issues**
   - Check React DevTools for unnecessary re-renders
   - Monitor network tab for excessive API calls

## 📈 Future Enhancements

Potential improvements for production use:
- **Real-time Updates** with WebSocket integration
- **Advanced Search** with Elasticsearch integration
- **Image Upload** for property photos
- **Map Integration** with property locations
- **Chat System** for user communication
- **Push Notifications** for new recommendations
- **Advanced Analytics** for user behavior
- **PWA Features** for offline support

## 📝 License

This project is part of a backend assessment demonstration and is for educational purposes.

## 🤝 Contributing

This is a demo application. For production use, consider:
1. Adding comprehensive testing (Jest, React Testing Library)
2. Implementing proper error boundaries
3. Adding performance monitoring
4. Setting up CI/CD pipelines
5. Adding comprehensive documentation
