# Property Listing System API Testing Guide

## Server Information
- **Base URL**: `http://localhost:5000`
- **Database**: MongoDB (localhost:27017)
- **Cache**: Redis (localhost:6379)

## Authentication Endpoints

### 1. Register User
```bash
curl -X POST "http://localhost:5000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### 2. Login User
```bash
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

## Property Endpoints

### 3. Get All Properties (with advanced filtering)
```bash
# Basic request
curl "http://localhost:5000/api/properties"

# With pagination
curl "http://localhost:5000/api/properties?page=1&limit=5"

# Advanced filtering
curl "http://localhost:5000/api/properties?type=Villa&city=Mumbai&minPrice=10000000&maxPrice=50000000&bedrooms=4&furnished=Furnished&sortBy=price&sortOrder=asc&limit=3"

# Search by text
curl "http://localhost:5000/api/properties?search=luxury&limit=3"

# Filter by amenities and tags
curl "http://localhost:5000/api/properties?amenities=pool,gym&tags=luxury,sea-view&limit=3"
```

### 4. Get Property by ID
```bash
curl "http://localhost:5000/api/properties/PROPERTY_ID"
```

### 5. Create Property (Requires Authentication)
```bash
curl -X POST "http://localhost:5000/api/properties" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Beautiful Villa",
    "type": "Villa",
    "price": 25000000,
    "state": "Maharashtra",
    "city": "Mumbai",
    "areaSqFt": 2500,
    "bedrooms": 4,
    "bathrooms": 3,
    "amenities": ["pool", "gym", "parking"],
    "furnished": "Furnished",
    "availableFrom": "2025-08-01",
    "listedBy": "Owner",
    "tags": ["luxury", "sea-view"],
    "colorTheme": "#ff6b6b",
    "rating": 4.5,
    "isVerified": true,
    "listingType": "sale"
  }'
```

### 6. Update Property (Requires Authentication & Ownership)
```bash
curl -X PUT "http://localhost:5000/api/properties/PROPERTY_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"price": 30000000, "rating": 4.8}'
```

### 7. Delete Property (Requires Authentication & Ownership)
```bash
curl -X DELETE "http://localhost:5000/api/properties/PROPERTY_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Favorites Endpoints

### 8. Add to Favorites
```bash
curl -X POST "http://localhost:5000/api/favorites/PROPERTY_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 9. Remove from Favorites
```bash
curl -X DELETE "http://localhost:5000/api/favorites/PROPERTY_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 10. Get User's Favorites
```bash
curl -X GET "http://localhost:5000/api/favorites" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Recommendation Endpoints

### 11. Search Users by Email
```bash
curl -X GET "http://localhost:5000/api/recommendations/search-users?email=friend" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 12. Recommend Property to User
```bash
curl -X POST "http://localhost:5000/api/recommendations/PROPERTY_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "email": "friend@example.com",
    "message": "Check out this amazing property!"
  }'
```

### 13. Get Received Recommendations
```bash
curl -X GET "http://localhost:5000/api/recommendations" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Available Filters

### Property Type
- Villa
- Apartment  
- Bungalow
- Studio
- Penthouse

### Furnished Status
- Furnished
- Unfurnished
- Semi

### Listed By
- Owner
- Agent
- Builder

### Listing Type
- rent
- sale

### Common Amenities
- lift, clubhouse, security, gym, garden, pool, parking, power-backup, wifi

### Common Tags
- gated-community, corner-plot, family-friendly, near-metro, luxury, lake-view, affordable, sea-view

## Sample Data Import

To import the CSV data:
```bash
npm run import-csv
```

This will import 1000 properties from the `data/properties.csv` file into MongoDB.

## Testing Workflow

1. Start the server: `npm run dev`
2. Register a user
3. Login to get JWT token
4. Test property endpoints with filtering
5. Add properties to favorites
6. Create a second user
7. Test recommendations between users
8. Test advanced search and filtering

## Features Implemented

✅ **Task 1**: CSV data import into MongoDB  
✅ **Task 2**: CRUD operations with user authorization  
✅ **Task 3**: Advanced search/filtering (10+ attributes)  
✅ **Task 4**: Redis caching for performance  
✅ **Task 5**: User registration and login  
✅ **Task 6**: Favorites CRUD operations  
✅ **Bonus**: Property recommendations with user search  

## Performance Features

- **Redis Caching**: Property queries are cached for 5 minutes
- **Database Indexing**: Optimized indexes for search performance
- **Pagination**: All property endpoints support pagination
- **Advanced Filtering**: Support for multiple simultaneous filters
- **Text Search**: MongoDB text search on title and tags 