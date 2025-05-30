import mongoose from 'mongoose';
import csv from 'csvtojson';
import dotenv from 'dotenv';
import Property from '../models/Property';
import path from 'path';

dotenv.config();

const importData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI!);

    console.log('Reading CSV file...');
    const csvPath = path.resolve(__dirname, '../../../data/properties.csv');
    const jsonArray = await csv().fromFile(csvPath);

    console.log('Transforming and importing data...');
    
    // Clear existing data
    await Property.deleteMany({});
    
    // Transform the data to match our schema
    const transformedData = jsonArray.map((item: any) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      price: parseInt(item.price),
      state: item.state,
      city: item.city,
      areaSqFt: parseInt(item.areaSqFt),
      bedrooms: parseInt(item.bedrooms),
      bathrooms: parseInt(item.bathrooms),
      amenities: item.amenities ? item.amenities.split('|') : [],
      furnished: item.furnished,
      availableFrom: new Date(item.availableFrom),
      listedBy: item.listedBy,
      tags: item.tags ? item.tags.split('|') : [],
      colorTheme: item.colorTheme,
      rating: parseFloat(item.rating),
      isVerified: item.isVerified === 'True',
      listingType: item.listingType
    }));

    await Property.insertMany(transformedData);
    console.log(`Data imported successfully! Imported ${transformedData.length} properties.`);
    process.exit();
  } catch (err) {
    console.error('Error during import:', err);
    process.exit(1);
  }
};

importData();