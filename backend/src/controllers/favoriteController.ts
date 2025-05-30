import { Request, Response } from 'express';
import User from '../models/User';
import Property from '../models/Property';
import mongoose from 'mongoose';

interface AuthenticatedRequest extends Request {
  userId?: mongoose.Types.ObjectId;
}

export const addFavorite = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { propertyId } = req.params;
    
    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const propertyObjectId = new mongoose.Types.ObjectId(propertyId);
    
    // Check if already in favorites
    if (user.favorites.includes(propertyObjectId)) {
      return res.status(400).json({ error: 'Property already in favorites' });
    }

    user.favorites.push(propertyObjectId);
    await user.save();

    return res.json({ message: 'Added to favorites' });
  } catch (err) {
    console.error('Add favorite error:', err);
    return res.status(500).json({ error: 'Failed to add favorite' });
  }
};

export const removeFavorite = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { propertyId } = req.params;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const propertyObjectId = new mongoose.Types.ObjectId(propertyId);
    
    // Check if property is in favorites
    const index = user.favorites.indexOf(propertyObjectId);
    if (index === -1) {
      return res.status(400).json({ error: 'Property not in favorites' });
    }

    user.favorites.splice(index, 1);
    await user.save();

    return res.json({ message: 'Removed from favorites' });
  } catch (err) {
    console.error('Remove favorite error:', err);
    return res.status(500).json({ error: 'Failed to remove favorite' });
  }
};

export const getFavorites = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(req.userId).populate({
      path: 'favorites',
      populate: {
        path: 'createdBy',
        select: 'email'
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user.favorites);
  } catch (err) {
    console.error('Get favorites error:', err);
    return res.status(500).json({ error: 'Failed to get favorites' });
  }
};