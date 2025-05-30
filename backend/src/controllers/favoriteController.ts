import { Request, Response } from 'express';
import User from '../models/User'; // Adjust the path as needed
import mongoose from 'mongoose';

interface AuthenticatedRequest extends Request {
  userId?: mongoose.Types.ObjectId;
}

export const addFavorite = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const propertyId = req.params.propertyId;
    const propertyObjectId = new mongoose.Types.ObjectId(propertyId);
    if (!user.favorites.includes(propertyObjectId)) {
      user.favorites.push(propertyObjectId);
      await user.save();
    }
    return res.json({ message: 'Added to favorites' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to add favorite' });
  }
};