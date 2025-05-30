import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ['Villa', 'Apartment', 'Bungalow', 'Studio', 'Penthouse'] },
  price: { type: Number, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  areaSqFt: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  amenities: [String],
  furnished: { type: String, enum: ['Furnished', 'Unfurnished', 'Semi'] },
  availableFrom: { type: Date },
  listedBy: { type: String, enum: ['Owner', 'Agent', 'Builder'] },
  tags: [String],
  colorTheme: String,
  rating: { type: Number, min: 0, max: 5 },
  isVerified: { type: Boolean, default: false },
  listingType: { type: String, enum: ['rent', 'sale'] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Index for better search performance
propertySchema.index({ type: 1, city: 1, price: 1, areaSqFt: 1 });
propertySchema.index({ title: 'text', tags: 'text' });

export default mongoose.model('Property', propertySchema);