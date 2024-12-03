import { connectToDatabase } from '../../../../lib/mongodb';

export async function GET(req, { params }) {
  const { option } = await params;

  console.log('Requested option:', option);

  // Connect to the database
  const db = await connectToDatabase();

  // Log the database name and collection to ensure connection
  console.log('Connected to DB:', db.databaseName);
  
  // Query the database to find the option data
  const data = await db
    .collection('options')
    .find({ parent: option })
    .toArray();

  // Log the result of the query
  console.log('Query result:', data);

  // If no data found, return a 404 response
  if (data.length === 0) {
    return new Response('Option not found', { status: 404 });
  }

  // Return the data as JSON
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}
