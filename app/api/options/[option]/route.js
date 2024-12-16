import { connectToDatabase } from '../../../../lib/mongodb';

export async function GET(req, { params }) {
  const { option } = await params;



  // Connect to the database
  const db = await connectToDatabase();

  
  // Query the database to find the option data
  const data = await db
    .collection('options')
    .find({ parent: option })
    .toArray();


  // If no data found, return a 404 response
  if (data.length === 0) {
    return new Response('Option not found', { status: 404 });
  }

  // Return the data as JSON
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}
