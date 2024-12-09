export const runtime = "nodejs"; // Ensure server-side runtime

export async function POST(req) {
  const body = await req.json();
  console.log("Received data Orch:", body);

  const {  id } = body;
  console.log("Received data Orch2:", body.id);

  //const filter = JSON.stringify({ _id: id });
  // const response = await fetch(`localhost:3000/api/crud?collectionName=yourCollectionName&filter=${encodeURIComponent(filter)}`);
  // if (!response.ok) throw new Error("Failed to fetch data"),
  // console.log("Received data Orch3:", response);

  try {
    const filter = JSON.stringify({ _id: id });
    const response = await fetch(`http://localhost:3000/api/crud?collectionName=yourCollectionName&filter=${encodeURIComponent(filter)}`);
    if (!response.ok) throw new Error("Failed to fetch data");
    
    const result = await response.json();
    const resources = result.data.data.resources;
    console.log("Received data Orch4:", result.data.data.resources);
    processResources(result.data.data.region, resources);
  } catch (err) {
    console.error("Error fetching data:", err);
    //setError(err.message || "An unexpected error occurred");
  }

  return new Response(
    JSON.stringify({ message: "All resources created successfully" , "id" : id }),
    { status: 201 }
  )
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
