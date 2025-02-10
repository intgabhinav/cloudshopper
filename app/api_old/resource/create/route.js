export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { jobId } = await req.json();

    if (!jobId) {
      throw new Error("Missing jobId");
    }

    // Fetch job details from the database
    const filter = JSON.stringify({ _id: jobId });
    const jobResponse = await fetch(
      `http://localhost:3000/api/crud?collectionName=jobs&filter=${encodeURIComponent(filter)}`
    );

    if (!jobResponse.ok) {
      throw new Error(`Failed to fetch job details for jobId ${jobId}`);
    }

    const jobDetails = await jobResponse.json();
    console.log("Fetched job details:", jobDetails);

    if (!jobDetails) {
      throw new Error(`No job found for jobId ${jobId}`);
    }

    const job = jobDetails; // Assuming jobDetails is a single object
    const { api, inputs, region, name } = job;

    if (!api || !inputs) {
      throw new Error("Missing API or inputs in the job data");
    }

    // Invoke the actual resource creation logic
    const baseUrl = "http://localhost:3000";
    const resourceCreationResponse = await fetch(`${baseUrl}${api}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ region, inputs, name }),
    });

    if (!resourceCreationResponse.ok) {
      throw new Error(
        `Resource creation failed for job ${jobId}: ${await resourceCreationResponse.text()}`
      );
    }

    const resourceCreationResult = await resourceCreationResponse.json();
    console.log(`Resource created successfully for job ${jobId}:`, resourceCreationResult);

    // Extract outputs from the resource creation result
    const outputs = resourceCreationResult.details || {};

    // Update the job's outputs field directly
    await fetch("http://localhost:3000/api/crud", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        collectionName: "jobs",
        filter: { _id: jobId },
        outputs, // Directly update the outputs field
        status: "completed", // Update the job's status as well
      }),
    });

    console.log(`Job ${jobId} updated with outputs`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Resource created for job ${jobId}`,
        outputs,
      }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in resource creation:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
}
