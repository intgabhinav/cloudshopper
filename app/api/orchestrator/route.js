export const runtime = "nodejs"; // Ensure server-side runtime

export async function POST(req) {
  const body = await req.json();
  const {  id } = body;

  try {
    const filter = JSON.stringify({ _id: id });
    const response = await fetch(`http://localhost:3000/api/crud?collectionName=orders&filter=${encodeURIComponent(filter)}`);
    if (!response.ok) throw new Error("Failed to fetch data");
    
    const result = await response.json();
    const resources = result.data.data.resources;
    
    for (const item of resources) {
      const response = await processResources(id, result.data.data.region, item);
    }

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
async function processResources(orderID, region, resource) {
  const results = [];
console.log( "Preocess: ",region, resource.inputs);

const inputs = resource.inputs || {};

const response = await fetch("http://localhost:3000/api/crud", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    collectionName: "jobs",
    data: {
      orderID:orderID,
      name: resource.command,
      type : resource.type,
     inputs
    }
 }
  ),
});

  //  try {
  // const response = await fetch(`http://localhost:3000${resources.api}`, {
  // method: "POST",
  // headers: { "Content-Type": "application/json" },
  // body: JSON.stringify({
  // region,
  // ...(resources.inputs || {}), // Pass additional data if provided
  // }),
    
  // });

  // if (!response.ok) {
  // throw new Error(`Failed to fetch ${item.api}: ${response.statusText}`);
  // }
  results.push({ name: resource.name, data: resource });
  // const responseData = await response.json();
  // results.push({ name: resources.name, data: responseData });
  // } catch (error) {
  // console.error(`Error processing resource ${resources.name}:`, error.message);
  // results.push({ name: resources.name, error: error.message });
  // }
  }

 

