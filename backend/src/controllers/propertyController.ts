import Property from '../models/Property';
import { Request, Response } from 'express';
import redis from '../utils/redis';

export const createProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.create({ ...req.body, createdBy: (req as any).userId });
    
    // Clear related cache
    await redis.del('properties:*');
    
    res.status(201).json(property);
  } catch (err) {
    console.error('Property creation error:', err);
    res.status(400).json({ error: 'Property creation failed' });
  }
};

export const getProperties = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      type,
      city,
      state,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      bedrooms,
      bathrooms,
      furnished,
      listedBy,
      listingType,
      amenities,
      tags,
      search,
      isVerified
    } = req.query;

    // Create cache key
    const cacheKey = `properties:${JSON.stringify(req.query)}`;
    
    // Check cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Build query
    const query: any = {};
    
    if (type) query.type = type;
    if (city) query.city = new RegExp(city as string, 'i');
    if (state) query.state = new RegExp(state as string, 'i');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice as string);
      if (maxPrice) query.price.$lte = parseInt(maxPrice as string);
    }
    if (minArea || maxArea) {
      query.areaSqFt = {};
      if (minArea) query.areaSqFt.$gte = parseInt(minArea as string);
      if (maxArea) query.areaSqFt.$lte = parseInt(maxArea as string);
    }
    if (bedrooms) query.bedrooms = parseInt(bedrooms as string);
    if (bathrooms) query.bathrooms = parseInt(bathrooms as string);
    if (furnished) query.furnished = furnished;
    if (listedBy) query.listedBy = listedBy;
    if (listingType) query.listingType = listingType;
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';
    if (amenities) {
      const amenitiesArray = (amenities as string).split(',');
      query.amenities = { $in: amenitiesArray };
    }
    if (tags) {
      const tagsArray = (tags as string).split(',');
      query.tags = { $in: tagsArray };
    }
    if (search) {
      query.$text = { $search: search as string };
    }

    // Calculate pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Sort configuration
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const properties = await Property.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('createdBy', 'email');

    const total = await Property.countDocuments(query);

    const result = {
      properties,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    };

    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(result));

    res.json(result);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ error: 'Error fetching properties' });
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id).populate('createdBy', 'email');
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (err) {
    console.error('Error fetching property:', err);
    res.status(500).json({ error: 'Error fetching property' });
  }
};

export const updateProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    if ((property?.createdBy as any).toString() !== (req as any).userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // Clear cache
    await redis.del('properties:*');
    
    res.json(updated);
  } catch (err) {
    console.error('Property update error:', err);
    res.status(400).json({ error: 'Update failed' });
  }
};

export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    if ((property?.createdBy as any).toString() !== (req as any).userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    await Property.findByIdAndDelete(req.params.id);
    
    // Clear cache
    await redis.del('properties:*');
    
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Property deletion error:', err);
    res.status(400).json({ error: 'Delete failed' });
  }
};
