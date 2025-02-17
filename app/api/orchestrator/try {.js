  try {
    const body = await req.json();
    const { orderID } = body;
    console.log("01 Orchestrator started with Order ID:", orderID);

    // Step 1: Fetch order details
    const orderResponse = await fetch(`http://localhost:3000/api/order?orderID=${orderID}`);
    if (!orderResponse.ok) throw new Error("Failed to fetch order details");
    const { order } = await orderResponse.json();
    console.log("02 Fetched order details:", order);

    // Step 2: Sort resources by order
    const sortedResources = order.resources.sort((a, b) => a.order - b.order);
    console.log("Sorted resources by order:", sortedResources);

    // Store job results dynamically as they complete
    const completedJobs = {};

    for (const resource of sortedResources) {
      const { name, type, parent, inputs = {} } = resource;

      // Get the matching resource template
      const template = resourceTemplates.find(t => t.type === type);
      if (!template) {
          console.error(`No template found for resource type: ${type}`);
          continue;
      }

      // Resolve parent dependencies
      const resolvedInputs = resolveInputs(template.inputs, parent, completedJobs, order.inputFields);

      // Construct the final request payload
      const requestData = {
          api: template.api,
          type: template.type,
          inputs: resolvedInputs
      };

      console.log(`Creating resource: ${name} (${type}) with data:`, requestData);

      // Simulate API call to create the resource
      const jobResult = await createResource(requestData);
      
      // Store job result for future dependencies
      completedJobs[name] = jobResult;
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