import User from '../models/User';
import Property from '../models/Property';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

interface AuthenticatedRequest extends Request {
  userId?: mongoose.Types.ObjectId;
}

export const recommendProperty = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { email, message } = req.body;
    const { propertyId } = req.params;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Find recipient by email
    const recipient = await User.findOne({ email });
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Check if sender is trying to recommend to themselves
    if (recipient._id.toString() === req.userId.toString()) {
      return res.status(400).json({ error: 'Cannot recommend property to yourself' });
    }

    const propertyObjectId = new mongoose.Types.ObjectId(propertyId);
    
    // Check if already recommended
    const existingRecommendation = recipient.recommendationsReceived.find(
      rec => rec.property.toString() === propertyObjectId.toString() && 
             rec.sender.toString() === req.userId!.toString()
    );

    if (existingRecommendation) {
      return res.status(400).json({ error: 'Property already recommended to this user' });
    }

    // Add recommendation
    recipient.recommendationsReceived.push({
      property: propertyObjectId,
      sender: req.userId,
      message: message || '',
      createdAt: new Date()
    } as any);

    await recipient.save();

    res.json({ message: 'Property recommended successfully' });
  } catch (err) {
    console.error('Recommendation error:', err);
    res.status(500).json({ error: 'Recommendation failed' });
  }
};

export const getRecommendations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(req.userId).populate({
      path: 'recommendationsReceived.property',
      populate: {
        path: 'createdBy',
        select: 'email'
      }
    }).populate('recommendationsReceived.sender', 'email');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.recommendationsReceived);
  } catch (err) {
    console.error('Get recommendations error:', err);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
};

export const searchUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }

    const users = await User.find({
      email: { $regex: email as string, $options: 'i' },
      _id: { $ne: req.userId } // Exclude current user
    }).select('email').limit(10);

    res.json(users);
  } catch (err) {
    console.error('Search users error:', err);
    res.status(500).json({ error: 'Failed to search users' });
  }
};
