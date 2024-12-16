import { MongoClient, ObjectId } from "mongodb";

// MongoDB client connection setup with connection pooling
const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function getDb() {
  if (!db) {
    await client.connect();
    db = client.db("cloudshopper"); // Access the "cloudshopper" database
  }
  return db;
}

export async function createRecord(collectionName, data) {
  try {
    const db = await getDb();
    const result = await db.collection(collectionName).insertOne({data});
    const id = result.insertedId.toString();
    //console.log("Inserted data with ID:", id);
    return { success: true, id: id };
  } catch (error) {
    console.error("Error creating record:", error);
    return { success: false, error: error.message };
  }
}

export async function readRecord(collectionName, filter) {
  try {
    const db = await getDb();
    // Handle case where _id needs to be converted to ObjectId
    if (filter._id && typeof filter._id === 'string') {
      filter._id = new ObjectId(filter._id);
    }
    const result = await db.collection(collectionName).findOne(filter);
    return result || null;
  } catch (error) {
    console.error("Error reading record:", error);
    return null;
  }
}

export async function updateRecord(collectionName, filter, updateData) {
  try {
    const db = await getDb();
    // Handle case where _id needs to be converted to ObjectId
    if (filter._id && typeof filter._id === 'string') {
      filter._id = new ObjectId(filter._id);
    }
    const result = await db
      .collection(collectionName)
      .updateOne(filter, { $set: updateData });

    return { success: true, modifiedCount: result.modifiedCount };
  } catch (error) {
    console.error("Error updating record:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteRecord(collectionName, filter) {
  try {
    const db = await getDb();
    // Handle case where _id needs to be converted to ObjectId
    if (filter._id && typeof filter._id === 'string') {
      filter._id = new ObjectId(filter._id);
    }
    const result = await db.collection(collectionName).deleteOne(filter);
    return { success: true, deletedCount: result.deletedCount };
  } catch (error) {
    console.error("Error deleting record:", error);
    return { success: false, error: error.message };
  }
}
