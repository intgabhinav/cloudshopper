export const runtime = "nodejs"; // Ensure server-side runtime

export async function POST(req) {
  try {
    const body = await req.json();

    const { id, region, resource } = body;
    //console.log("Received data:", id, region, resource);

    // Step 1: Create Job
    const resultCreateJob = await createJob(id, region, resource.data);

    if (!resultCreateJob.success) {
      return new Response(
        JSON.stringify({ success: false, error: resultCreateJob.error }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }
    // Step 2: Process Resource
    const resultProcessResource = await processResource(id, region, resource.data);

    if (!resultProcessResource.success) {
      return new Response(
        JSON.stringify({ success: false, error: resultProcessResource.error }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }

    const resultUpdateJob = await updateJob(resultCreateJob.id, {
      status: "completed",
      outputs: resultProcessResource.results[0].data,     
    });        

    console.log("resultUpdateJob: ", resultUpdateJob);

    if (!resultUpdateJob.success) {
      return new Response(
        JSON.stringify({ success: false, error: resultUpdateJob.error }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ message: "All resources created successfully", resultProcessResource, id }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal Server Error" }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
}

// Function to create a job
async function createJob(orderID, region, resource) {
  try {
    const inputs = resource.inputs || {};

    const response = await fetch("http://localhost:3000/api/crud", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        collectionName: "jobs",
        data: {
          orderID,
          region,
          name: resource.command,
          type: resource.type,
          status: "created",
          inputs,
        },
      }),
    });

    return response.json();
  } catch (error) {
    console.error("Error in createJob:", error);
    return { success: false, error: error.message };
  }
}

// Function to process a resource
async function processResource(id, region, resource) {
  const results = [];

  try {
    const response = await fetch(`http://localhost:3000${resource.api}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        region,
        ...(resource.inputs || {}), // Pass additional data if provided
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${resource.api}: ${response.statusText}`);
    }

    const responseData = await response.json();
    results.push({ name: resource.name, data: responseData });
    return { success: true, results };
  } catch (error) {
    console.error(`Error processing resource ${resource.name}:`, error.message);
    results.push({ name: resource.name, error: error.message });
    return { success: false, error: error.message };
  }
}

import { ObjectId } from "mongodb";

async function updateJob(id, data) {
  try {
    const filter = { _id: id }; 
    const response = await fetch(`http://localhost:3000/api/crud`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        collectionName: "jobs",
        filter,
        data,
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Failed to update job: ${response.statusText}, ${errorDetails}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating job:", error.message);
    return { success: false, error: error.message };
  }
}

