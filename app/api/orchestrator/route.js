export const runtime = "nodejs"; // Ensure server-side runtime
import { connectToDatabase } from "../../../lib/mongodb";

export async function POST(req) {
  const body = await req.json();
  console.log("Received data Orch:", body);

  const {  resources } = body;
  console.log("Received data Orch2:", resources.resources, resources.region);
  // Validate the payload
  // if (!Array.isArray(resources) || resources.length === 0) {
  //   console.log("Invalid request payload");
  //   return new Response(
  //     JSON.stringify({ error: "Invalid request payload" }),
  //     { status: 400 }
  //   );
  // }

  // Connect to the database (if needed later)
  const db = await connectToDatabase();

  try {
    // Process the resources
    const results = await processResources( resources.region,resources.resources);

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in processing resources:", error.message);

    return new Response(
      JSON.stringify({ error: "Failed to process resources", details: error.message }),
      { status: 500 }
    );
  }
}

// Function to process multiple resources
async function processResources(region, resources) {
  const results = [];
console.log(region);

  for (const item of resources) {
    console.log(`Processing resourceOrch: ${item.name} ${region}`);
    try {
      
      const response = await fetch(`http://localhost:3000${item.api}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region,
          ...(item.inputs || {}), // Pass additional data if provided
        }),
    
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${item.api}: ${response.statusText}`);
      }

      const responseData = await response.json();
      results.push({ name: item.name, data: responseData });
    } catch (error) {
      console.error(`Error processing resource ${item.name}:`, error.message);
      results.push({ name: item.name, error: error.message });
    }
  }

  return results;
}
