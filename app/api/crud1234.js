// /pages/api/crud.js
import { createRecord, readRecord, updateRecord, deleteRecord } from "../../lib/crud"; // Import CRUD operations

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      // Read operation
      try {
        const { id } = req.query;
        const result = await readRecord("yourCollectionName", { _id: new ObjectId(id) });
        if (result) {
          res.status(200).json(result);
        } else {
          res.status(404).json({ message: "Record not found" });
        }
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch record", error: error.message });
      }
      break;
    case 'POST':
      // Create operation
      try {
        const data = req.body.json();
        console.log("Received data:", data);
        const result = await createRecord("yourCollectionName", data);
        console.log("Created record:", result);
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ message: "Failed to create record", error: error.message });
      }
      break;
    case 'PUT':
      // Update operation
      try {
        const { id } = req.query;
        const updateData = req.body;
        const result = await updateRecord("yourCollectionName", { _id: new ObjectId(id) }, updateData);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ message: "Failed to update record", error: error.message });
      }
      break;
    case 'DELETE':
      // Delete operation
      try {
        const { id } = req.query;
        const result = await deleteRecord("yourCollectionName", { _id: new ObjectId(id) });
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ message: "Failed to delete record", error: error.message });
      }
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
      break;
  }
}
