export const runtime = "nodejs"; // Ensure server-side runtime

export async function POST(req) {
  try{
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
    console.log("03 Sorted resources by order:", sortedResources);

    let currentOrder = -1;
    let jobPromises = [];
    const completedJobs = {};
    // Process each resource in order
    for (const resource of sortedResources) {
      const { name, type, parent, inputs = {} } = resource;
      console.log("Resources: " , name, type, parent, inputs);
      if (resource.order !== currentOrder) {
        // Wait for all jobs from the previous order to complete before starting the new order
        if (jobPromises.length > 0) {
          await Promise.all(jobPromises);  // Wait for the previous order's tasks to finish
          jobPromises = [];  // Reset job promises for the next order
        }
        currentOrder = resource.order;
      }
      console.log(`04 Processing resource: ${resource.name}`);

      //Step 3: Check if the resource creation job already exists and is completed
      const filter = JSON.stringify({ orderID: orderID, name: resource.name });
      const jobCheckResponse = await fetch(
        `http://localhost:3000/api/crud?collectionName=jobs&filter=${encodeURIComponent(filter)}`
      );
      const jobCheck = await jobCheckResponse.json();
      if (jobCheck ) {
        if (jobCheck && jobCheck.status === "completed"){
          completedJobs[resource.name] = {"outputs" : jobCheck.outputs};
          console.log(`Resource ${resource.name} already created. Skipping.`, jobCheck._id, completedJobs);
          continue;
        }

        if (jobCheck && jobCheck.status === "created"){
        // Trigger resource creation
        console.log("JobCheck: " , jobCheck._id);
        const resourceCreationResponse = fetch("http://localhost:3000/api/createresource", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId: jobCheck._id }),
        });
        completedJobs[resource.name] = (await resourceCreationResponse).body.outputs;
        console.log( "CompletedJobs: " , completedJobs)
        continue;
        }

      }

      // Step 4: Fetch resource template
      const resourceTemplateResponse = await fetch(
        `http://localhost:3000/api/crud?collectionName=resourcesv2&filter=${encodeURIComponent(
          JSON.stringify({ type: resource.type })
        )}`
      );
      const resourceTemplate = await resourceTemplateResponse.json();
      console.log(`05 Fetched resource template for resource ${resource.name}:`, resourceTemplate);


        // Resolve parent dependencies
        console.log("Dependencies: " , resourceTemplate.inputs, parent, completedJobs, order.inputFields);
        const resolvedInputs = resolveInputs(resourceTemplate.inputs, parent, completedJobs, order.inputFields);
        console.log("resolveInputs: " , resolveInputs.J);

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
        console.log("JobID: " , jobId);

        // // Trigger resource creation
        // const resourceCreationResponse = fetch("http://localhost:3000/api/resource/create", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ jobId }),
        // });

        //jobPromises.push(resourceCreationResponse);  // Add job creation to the jobPromises array
      } else {
        console.error("Failed to create job:", jobResult.error);
      }

    }


    return new Response(
      JSON.stringify({ success: true, message: "Orchestration and job creation completed successfully" }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );

  }catch (err) {
    console.error("Orchestrator Error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

}

// Helper function to resolve inputs dynamically
function resolveInputs(templateInputs, parentNames, completedJobs, inputFields) {
  const resolvedInputs = JSON.parse(JSON.stringify(templateInputs)); // Deep copy
  console.log ("resolvedInputs02: " , resolvedInputs, parentNames,completedJobs, inputFields);

  // Replace placeholders with input fields
  Object.keys(resolvedInputs).forEach(key => {
    console.log("Map: " , key, resolvedInputs[key]);

      if (typeof resolvedInputs[key] === 'string') {
          resolvedInputs[key] = resolvedInputs[key].replace(/\{inputFields\.(\w+)\}/g, (_, field) => inputFields[field] || '');
      }
  });

  // Replace parent references with job results
  if (parentNames) {
      Object.keys(resolvedInputs).forEach(key => {
          if (Array.isArray(resolvedInputs[key])) {
              resolvedInputs[key] = resolvedInputs[key].map(value => 
                  replaceParentValue(value, parentNames, completedJobs)
              );
          } else {
              resolvedInputs[key] = replaceParentValue(resolvedInputs[key], parentNames, completedJobs);
          }
      });
  }

  return resolvedInputs;
}

// Helper function to replace parent values from job results
function replaceParentValue(value, parentNames, completedJobs) {
  if (typeof value === 'string') {
      return value.replace(/\{jobs\.(\w+)\.outputs\.(\w+)\}/g, (_, parentName, outputField) => {
          return completedJobs[parentName]?.outputs[outputField] || '';
      });
  }
  return value;
}

// Simulated API call
async function createResource(requestData) {
  return new Promise(resolve => {
      setTimeout(() => {
          resolve({
              outputs: {
                  SubnetId: `subnet-${Math.floor(Math.random() * 100000)}`,
                  VpcId: `vpc-${Math.floor(Math.random() * 100000)}`
              }
          });
      }, 1000);
  });
}
