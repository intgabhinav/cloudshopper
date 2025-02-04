export const runtime = "nodejs"; // Ensure server-side runtime

export async function POST(req) {
  try {
    const body = await req.json();
    const { orderID } = body;
    console.log("01 Orchestrator started with Order ID:", orderID);

    // Step 1: Fetch order details
    const orderResponse = await fetch(`http://localhost:3000/api/orders?orderID=${orderID}`);
    if (!orderResponse.ok) throw new Error("Failed to fetch order details");
    const { order } = await orderResponse.json();
    console.log("02 Fetched order details:", order);

    // Step 2: Sort resources by order
    const sortedResources = order.resources.sort((a, b) => a.order - b.order);
    console.log("Sorted resources by order:", sortedResources);

    // Step 3: Process resources by order
    let currentOrder = -1;
    let jobPromises = [];

    for (const resource of sortedResources) {
      if (resource.order !== currentOrder) {
        // Wait for all jobs from the previous order to complete before starting the new order
        if (jobPromises.length > 0) {
          await Promise.all(jobPromises);  // Wait for the previous order's tasks to finish
          jobPromises = [];  // Reset job promises for the next order
        }
        currentOrder = resource.order;
        console.log(`Processing resources of order ${currentOrder}`);
      }

      console.log(`Processing resource: ${resource.name}`);

      // Check if the resource creation job already exists and is completed
      const filter = JSON.stringify({ orderID, name: resource.name });
      const jobCheckResponse = await fetch(
        `http://localhost:3000/api/crud?collectionName=jobs&filter=${encodeURIComponent(filter)}`
      );
      const jobCheck = await jobCheckResponse.json();
      console.log(`Job check for ${resource.name}:`, jobCheck);

      if (jobCheck && jobCheck.status === "completed") {
        console.log(`Resource ${resource.name} already created. Skipping.`);
        continue;
      }

      let parentDetailsArray = [];
      if (resource.parent && Array.isArray(resource.parent)) {
        // Fetch details for all parents of the resource
        for (const parent of resource.parent) {
          const responseParent = await fetch("http://localhost:3000/api/parents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderID, parentName: parent }),
          });

          if (!responseParent.ok) {
            console.error(`Failed to fetch parent: ${parent}`);
            continue;
          }

          const { parentDetails } = await responseParent.json();
          console.log(`Fetched parent details for ${parent}:`, parentDetails);
          if (parentDetails) parentDetailsArray.push({ name: parent, details: parentDetails });
        }

        console.log(`Resolved parents for resource ${resource.name}:`, parentDetailsArray);
      }

      // Step 3: Fetch resource template
      const resourceTemplateResponse = await fetch(
        `http://localhost:3000/api/crud?collectionName=resourcesv1&filter=${encodeURIComponent(
          JSON.stringify({ type: resource.type })
        )}`
      );
      const resourceTemplate = await resourceTemplateResponse.json();
      console.log(`Fetched resource template for resource ${resource.name}:`, resourceTemplate);

      // Step 4: Resolve placeholders
      const placeholderResponse = await fetch("http://localhost:3000/api/placeholders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: resourceTemplate, parentDetailsArray, inputFields: order.inputFields }),
      });
      const { resolvedInputs } = await placeholderResponse.json();
      console.log(`Resolved inputs for resource ${resource.name}:`, resolvedInputs);

      const mergedInputs = (resource.inputs && Object.keys(resource.inputs).length > 0)
        ? { ...resolvedInputs, ...resource.inputs }
        : resolvedInputs;

      // Step 5: Send job creation request to the CRUD API
      const jobData = {
        orderID,
        region: order.region,
        name: resource.name,
        type: resource.type,
        api: resourceTemplate.api,
        inputs: mergedInputs,
        status: "created",
      };

      const jobCreationResponse = await fetch("http://localhost:3000/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });

      const jobResult = await jobCreationResponse.json();
      if (jobResult.success) {
        const jobId = jobResult.id;

        // Trigger resource creation
        const resourceCreationResponse = fetch("http://localhost:3000/api/resource/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId }),
        });

        jobPromises.push(resourceCreationResponse);  // Add job creation to the jobPromises array
      } else {
        console.error("Failed to create job:", jobResult.error);
      }
    }

    // Wait for any remaining jobs to finish
    if (jobPromises.length > 0) {
      await Promise.all(jobPromises);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Orchestration and job creation completed successfully" }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  } catch (err) {
    console.error("Orchestrator Error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
