export const runtime = "nodejs"; // Ensure server-side runtime

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, region, name, api, processedTemplate } = body;
    console.log("Received data:", body);

    // Step 1: Create Job
    const resultCreateJob = await createJob(id, region, name, api, processedTemplate);

    if (!resultCreateJob.success) {
      return new Response(
        JSON.stringify({ success: false, error: resultCreateJob.error }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }

    console.log("Job created successfully:", resultCreateJob);

    // Step 2: Process Resource
    const resultProcessResource = await processResource(
      id,
      region,
      api,
      processedTemplate.inputs
    );

    if (!resultProcessResource.success) {
      return new Response(
        JSON.stringify({ success: false, error: resultProcessResource.error }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }

    console.log("Resource processed successfully:", resultProcessResource);

    // Step 3: Update Job Status to 'completed'
    const resultUpdateJob = await updateJob(resultCreateJob.id, {
      status: "completed",
      outputs: resultProcessResource.results[0]?.data || {},
    });

    if (!resultUpdateJob.success) {
      return new Response(
        JSON.stringify({ success: false, error: resultUpdateJob.error }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }

    console.log("Job updated successfully:", resultUpdateJob);

    // Success Response
    return new Response(
      JSON.stringify({
        success: true,
        message: "All resources created and job updated successfully",
        jobID: resultCreateJob.id,
        resourceResults: resultProcessResource.results,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
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
async function createJob(orderID, region, name, api, processedTemplate) {
  try {
    const inputs = processedTemplate.inputs || {};

    const response = await fetch("http://localhost:3000/api/crud", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        collectionName: "jobs",
        data: {
          orderID,
          region,
          name: name,
          type: processedTemplate.type,
          api,
          status: "created",
          inputs,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create job: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in createJob:", error);
    return { success: false, error: error.message };
  }
}

// Function to process a resource
async function processResource(id, region, api, inputs) {
  const results = [];

  try {
    console.log("Processing resource with inputs:", inputs);

    const response = await fetch(`http://localhost:3000${api}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        region,
        ...(inputs || {}), // Pass additional input data
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to process resource: ${response.statusText}`);
    }

    const responseData = await response.json();
    results.push({ name: api, data: responseData });

    console.log("Resource processed successfully:", responseData);
    return { success: true, results };
  } catch (error) {
    console.error(`Error processing resource at ${api}:`, error.message);
    results.push({ name: api, error: error.message });
    return { success: false, error: error.message };
  }
}

// Function to update a job
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
