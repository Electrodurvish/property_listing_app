import mongoose from 'mongoose';
import csv from 'csvtojson';
import dotenv from 'dotenv';
import Property from '../models/Property';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

dotenv.config();

const downloadCSV = async (url: string, filepath: string) => {
  const writer = fs.createWriteStream(filepath);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });
  (response.data as NodeJS.ReadableStream).pipe(writer);
  return new Promise<void>((resolve, reject) => {
    writer.on('finish', () => resolve());
    writer.on('error', () => reject());
  });
};

const importData = async () => {
  try {
    const csvUrl = 'https://cdn2.gro.care/db424fd9fb74_1748258398689.csv';
    const localPath = path.resolve(__dirname, '../../data/properties.csv');

    console.log('Downloading CSV...');
    await downloadCSV(csvUrl, localPath);

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI!);

    console.log('Reading CSV file...');
    const jsonArray = await csv().fromFile(localPath);

    console.log('Importing into MongoDB...');
    await Property.insertMany(jsonArray);
    console.log('Data imported successfully!');
    process.exit();
  } catch (err) {
    console.error('Error during import:', err);
    process.exit(1);
  }
};

importData();