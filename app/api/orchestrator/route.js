export const runtime = "nodejs"; // Ensure server-side runtime

export async function POST(req) {
  try {
    const body = await req.json();
    const { orderID } = body;
    console.log("Orchestrator started with Order ID:", orderID);

    // Step 1: Fetch order details
    const orderResponse = await fetch(`http://localhost:3000/api/orders?orderID=${orderID}`);
    if (!orderResponse.ok) throw new Error("Failed to fetch order details");
    const { order } = await orderResponse.json();
    console.log("Fetched order details:", order);

    // Step 2: Process resources
    for (const resource of order.resources) {
      if (resource.parent && Array.isArray(resource.parent)) {
        const parentDetailsArray = [];

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

        // Step 3: Fetch resource template
        const filter = JSON.stringify({ type: resource.type });
        const resourceTemplateResponse = await fetch(
          `http://localhost:3000/api/crud?collectionName=resources&filter=${encodeURIComponent(filter)}`
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

        // Step 5: Send job creation request to the CRUD API
        const jobData = {
          orderID,
          region: order.region,
          name: resource.name,
          type: resource.type,
          api: resourceTemplate.api,
          inputs: resolvedInputs,
          status: "created",
        };

        const jobCreationResponse = await fetch("http://localhost:3000/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jobData),
        });

        if (!jobCreationResponse.ok) {
          console.error(`Failed to create job for resource ${resource.name}:`, await jobCreationResponse.text());
        } else {
          const { id } = await jobCreationResponse.json();
          console.log(`Job created successfully for resource ${resource.name}:`, id);
        }
      }
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
