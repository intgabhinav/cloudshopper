import { connectToDatabase } from '../../../lib/mongodb';
export const runtime = "nodejs"; // Ensure server-side runtime


// POST /api/aws/create-resources
export async function POST(req) {
  const body = await req.json();
  console.log("Received data:", body);
  const { selectedFirstOption, selectedSecondSetOption, inputFields } = body;
  console.log("Parsed data:", selectedFirstOption, selectedSecondSetOption, inputFields.region);
  if (!selectedFirstOption || !selectedSecondSetOption || !inputFields) {
    return new Response(
      JSON.stringify({ error: "Invalid request payload" }),
      { status: 400 }
    );
  }
  
  
  const db = await connectToDatabase();

  const data = await db
  .collection('builder')
  .find({ 
    $and: [
      { bundle: selectedFirstOption }, 
      { plan: selectedSecondSetOption }, // Second condition
      
    ],
  })
  .toArray();



  console.log("Query result:", data);
  if (data.length === 0) {
    return new Response('Option not found', { status: 404 });
  }

  // Return the data as JSON
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}

