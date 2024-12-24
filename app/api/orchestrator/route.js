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
        
    
        console.log(`Resolved parents for resource ${resource.name}:`, parentDetailsArray);

        console.log(`Processing resource: ${resource.name} ${resource.type}`);

        // Step 4: Fetch resource template
        const filter = JSON.stringify({ type: resource.type });
        const resourceTemplateResponse = await fetch(
          `http://localhost:3000/api/crud?collectionName=resources&filter=${encodeURIComponent(filter)}`
        );
        const  resourceTemplate  = await resourceTemplateResponse.json();
        console.log(`Fetched resource template for resource ${resource.name}:`, resourceTemplate);


                          // Step 5: Resolve placeholders
      const placeholderResponse = await fetch(`http://localhost:3000/api/placeholders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: resourceTemplate, parentDetailsArray }),
      });
      const { resolvedInputs } = await placeholderResponse.json();

      console.log(`Resolved inputs for resource ${resource.name}:`, resolvedInputs);
      }
    }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Orchestration completed successfully" }),
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