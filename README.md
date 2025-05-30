# Property Listing System

A comprehensive full-stack property listing system with advanced filtering, user authentication, favorites, and property recommendations. Built with Node.js + TypeScript backend and React + TypeScript frontend.

## 🚀 Features

### Core Requirements ✅
- **CSV Data Import**: Import property data from CSV into MongoDB
- **CRUD Operations**: Full property management with user authorization
- **Advanced Filtering**: Search by 10+ attributes with pagination and sorting
- **Redis Caching**: Optimized read/write operations with caching
- **User Authentication**: JWT-based registration and login
- **Favorites System**: Users can favorite/unfavorite properties

### Bonus Features ✅
- **Property Recommendations**: Users can recommend properties to other users
- **User Search**: Find users by email for recommendations
- **Modern Frontend**: Complete React TypeScript interface
- **Real-time Notifications**: Track recommendation history with sender details

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js + TypeScript + Express.js
- **Database**: MongoDB with optimized indexing
- **Caching**: Redis for performance optimization
- **Authentication**: JWT with bcrypt password hashing
- **Data Processing**: CSV import with data transformation

### Frontend
- **Framework**: React 18 + TypeScript
- **Routing**: React Router for client-side navigation
- **State Management**: React Context API
- **HTTP Client**: Axios with interceptors
- **Styling**: CSS-in-JS with responsive design
- **UI/UX**: Modern, accessible interface

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation)
- Redis (local installation or Docker)
- Git

## 🔧 Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd property-listing-system
```

### 2. Setup Backend
```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/property-listing-system
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
REDIS_URL=redis://localhost:6379
NODE_ENV=development
EOF
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```

### 4. Start Services

**MongoDB**: Make sure MongoDB is running locally
```bash
mongod
```

**Redis**: Start Redis server (or use Docker)
```bash
# Using Docker
docker run -d -p 6379:6379 --name redis redis

# Or start local Redis
redis-server
```

### 5. Import Sample Data
```bash
cd backend
npm run import-csv
```

### 6. Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🎯 Application Overview

### Frontend Features
- **Property Browsing**: Advanced filtering with 10+ attributes
- **User Registration/Login**: Secure authentication with JWT
- **Favorites Management**: Personal property favorites list
- **Property Recommendations**: Send/receive property recommendations
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Live feedback on user actions

### Backend API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

#### Properties
- `GET /api/properties` - Get properties with advanced filtering
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create property (auth required)
- `PUT /api/properties/:id` - Update property (auth + ownership required)
- `DELETE /api/properties/:id` - Delete property (auth + ownership required)

#### Favorites
- `GET /api/favorites` - Get user's favorites
- `POST /api/favorites/:propertyId` - Add to favorites
- `DELETE /api/favorites/:propertyId` - Remove from favorites

#### Recommendations
- `GET /api/recommendations` - Get received recommendations
- `POST /api/recommendations/:propertyId` - Recommend property to user
- `GET /api/recommendations/search-users` - Search users by email

## 🔍 Advanced Filtering

The system supports filtering by all these attributes:

- **Basic**: `type`, `city`, `state`, `listingType` (rent/sale)
- **Price**: `minPrice`, `maxPrice`
- **Size**: `minArea`, `maxArea`, `bedrooms`, `bathrooms`
- **Features**: `furnished`, `listedBy`, `isVerified`
- **Arrays**: `amenities`, `tags` (comma-separated)
- **Search**: `search` (text search on title and tags)
- **Pagination**: `page`, `limit`
- **Sorting**: `sortBy`, `sortOrder` (asc/desc)

### Example Query
```bash
GET /api/properties?type=Villa&city=Mumbai&minPrice=10000000&maxPrice=50000000&bedrooms=4&amenities=pool,gym&tags=luxury&sortBy=price&sortOrder=asc&page=1&limit=10
```

## 💾 Database Schema

### Property Model
```typescript
{
  id: String (unique),
  title: String,
  type: enum ['Villa', 'Apartment', 'Bungalow', 'Studio', 'Penthouse'],
  price: Number,
  state: String,
  city: String,
  areaSqFt: Number,
  bedrooms: Number,
  bathrooms: Number,
  amenities: [String],
  furnished: enum ['Furnished', 'Unfurnished', 'Semi'],
  availableFrom: Date,
  listedBy: enum ['Owner', 'Agent', 'Builder'],
  tags: [String],
  colorTheme: String,
  rating: Number (0-5),
  isVerified: Boolean,
  listingType: enum ['rent', 'sale'],
  createdBy: ObjectId (User reference)
}
```

### User Model
```typescript
{
  email: String (unique),
  password: String (hashed),
  favorites: [ObjectId] (Property references),
  recommendationsReceived: [{
    property: ObjectId (Property reference),
    sender: ObjectId (User reference),
    message: String,
    createdAt: Date
  }]
}
```

## 🎮 Usage Guide

### Getting Started
1. **Register** a new account or login with existing credentials
2. **Browse Properties** on the main page with advanced filters
3. **Add Favorites** by clicking the heart icon (requires login)
4. **Recommend Properties** to others by clicking the share icon
5. **View Recommendations** received from other users

### Advanced Usage
- **Filter Properties**: Use the comprehensive filter system with 10+ attributes
- **Search Users**: Find users by email when sending recommendations
- **Manage Favorites**: Access your favorites in the dedicated section
- **Track Recommendations**: View all received recommendations with messages

## 🚀 Deployment

### Build Applications
```bash
# Build backend
cd backend
npm run build

# Build frontend
cd ../frontend
npm run build
```

### Production Deployment Options

#### Option 1: Railway (Recommended)
1. Connect your GitHub repository to Railway
2. Deploy backend with build command: `npm install && npm run build`
3. Deploy frontend with build command: `npm install && npm run build`
4. Set environment variables in Railway dashboard

#### Option 2: Vercel + Railway
1. Deploy backend to Railway
2. Deploy frontend to Vercel
3. Update frontend API URL to point to Railway backend

#### Option 3: Traditional VPS
1. Setup Node.js, MongoDB, and Redis on server
2. Clone repository and build both applications
3. Use PM2 for process management
4. Setup Nginx as reverse proxy

## 📊 Performance Features

- **Redis Caching**: Property queries cached for 5 minutes
- **Database Indexing**: Optimized indexes on frequently queried fields
- **Pagination**: Efficient data loading with limit/offset
- **Text Search**: MongoDB text index for fast text searches
- **Connection Pooling**: Optimized database connections
- **Code Splitting**: Frontend lazy loading for better performance

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Mongoose schema validation + frontend validation
- **Authorization**: Route-level access control
- **CORS**: Cross-origin request handling
- **XSS Prevention**: React's built-in protection

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run dev

# API testing examples in API_TESTING.md
```

### Frontend Testing
```bash
cd frontend
npm start

# Manual testing through the UI
# All features accessible through the interface
```

## 🗂 Project Structure

```
property-listing-system/
├── backend/                 # Node.js + TypeScript API
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Authentication & validation
│   │   └── utils/          # Helper functions
│   ├── data/               # CSV data file
│   ├── dist/               # Compiled JavaScript (after build)
│   └── package.json
├── frontend/               # React + TypeScript UI
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── contexts/       # React Context providers
│   │   └── services/       # API service layer
│   ├── public/             # Static assets
│   └── package.json
├── README.md              # This file
└── API_TESTING.md         # API testing examples
```

## 🐛 Troubleshooting

### Common Issues

1. **Frontend can't connect to backend**
   - Ensure backend is running on port 5000
   - Check CORS configuration in backend
   - Verify API URL in frontend config

2. **MongoDB Connection Error**
   - Ensure MongoDB is running: `sudo systemctl start mongod`
   - Check connection string in `.env`

3. **Redis Connection Error**
   - Start Redis: `redis-server` or `docker start redis`
   - Verify Redis is on port 6379

4. **Port Already in Use**
   - Change PORT in `.env` or kill process: `sudo lsof -t -i:5000 | xargs kill`

5. **Import CSV Fails**
   - Ensure `data/properties.csv` exists
   - Check file permissions: `chmod 644 data/properties.csv`

## 📈 Assessment Completion Status

### Core Requirements ✅
- [x] CSV data import into MongoDB
- [x] Property CRUD operations with user authorization
- [x] Advanced search/filtering (10+ attributes)
- [x] Redis caching integration
- [x] User registration/login with JWT
- [x] Favorites system CRUD

### Bonus Features ✅
- [x] Property recommendations between users
- [x] Complete frontend application
- [x] Production-ready deployment setup
- [x] Comprehensive documentation

### Additional Features ✅
- [x] TypeScript for full type safety
- [x] Responsive mobile-friendly design
- [x] Modern React with hooks and context
- [x] Advanced filtering UI with 10+ attributes
- [x] Real-time user search for recommendations
- [x] Error handling and loading states
- [x] Accessible design with keyboard navigation
- [x] Clean, professional UI/UX

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

This is an assessment project demonstrating backend and frontend development skills. For production use, consider:

1. Adding comprehensive testing (Jest, React Testing Library)
2. Implementing proper error boundaries
3. Adding performance monitoring
4. Setting up CI/CD pipelines
5. Adding end-to-end testing
6. Implementing real-time features with WebSockets
7. Adding image upload and management
8. Integrating maps for property locations

## 📞 Support

For support and questions:
- Review the troubleshooting section
- Check API documentation in `API_TESTING.md`
- Review frontend documentation in `frontend/README.md` 