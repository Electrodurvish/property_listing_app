import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  name: String,
  price: Number,
  location: String,
  type: String,
  size: Number,
  bedrooms: Number,
  bathrooms: Number,
  amenities: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Property', propertySchema);