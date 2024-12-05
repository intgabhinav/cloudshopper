import { connectToDatabase } from '../../../lib/mongodb';
export const runtime = "nodejs"; // Ensure server-side runtime


// POST /api/aws/create-resources
export async function POST(req) {
  const body = await req.json();
  const { selectedFirstOption, selectedSecondSetOption, inputFields } = body;
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
      { plan: selectedSecondSetOption }, 
    ],
  })
  .toArray();

  if (data.length === 0) {
    return new Response('Option not found', { status: 404 });
  }
  data.forEach((item) => {
    console.log(`Bundle: ${item.bundle}`);
    console.log(`Plan: ${item.plan}`);
    
    item.resources.forEach((resource) => {
      console.log(`  Resource Name: ${resource.name}`);
      console.log(`  API Endpoint: ${resource.api}`);
      console.log(`  Template ID: ${resource.templateid}`);

      
    });
  });
  // Return the data as JSON
  console.log("Query result:", data);
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}

