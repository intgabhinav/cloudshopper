// lib/mongodb.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToDatabase() {
  // Connect to the database if not already connected
  await client.connect();
  return client.db('cloudshopper'); // Returns the database instance
}
