export const runtime = "nodejs";

export async function POST(req) {
  const body = await req.json();
  const { id } = body; // Order ID
  console.log("Received Order ID:", id);

  try {
    // 1. Fetch the Order by ID
    const filter = JSON.stringify({ _id: id });
    const responseOrder = await fetch(
      `http://localhost:3000/api/crud?collectionName=orders&filter=${encodeURIComponent(filter)}`
    );
    if (!responseOrder.ok) throw new Error("Failed to fetch order data");

    const resultOrder = await responseOrder.json();
    const orderData = resultOrder.data.data;

    console.log("Fetched Order Data:", orderData);

    // 2. Iterate over Resources
    for (const resource of orderData.resources) {
      console.log(`Processing resource: ${resource.name} (${resource.type})`);

      // Fetch Resource Template from Resources Collection
      const resourceFilter = JSON.stringify({ type: resource.type });
      const responseResource = await fetch(
        `http://localhost:3000/api/crud?collectionName=resources&filter=${encodeURIComponent(resourceFilter)}`
      );
      if (!responseResource.ok) throw new Error("Failed to fetch resource template");

      const resourceTemplate = await responseResource.json();
      let processedTemplate = resourceTemplate.data;

      console.log("Fetched Resource Template:", processedTemplate);

      // 3. Fetch Parent Data if Parent Exists
      let parentData = {};
      if (Array.isArray(processedTemplate.parent)) {
        for (const parent of processedTemplate.parent) {
          const parentKey = Object.keys(parent)[0]; // e.g., "vpc"
          const parentType = parent[parentKey]; // e.g., "AWS::EC2::VPC"

          console.log(`Fetching parent ${parentKey} of type ${parentType}`);

          const parentFilter = JSON.stringify({
            "data.orderID": id,
            "data.name": parentKey
          });

          const responseParent = await fetch(
            `http://localhost:3000/api/crud?collectionName=jobs&filter=${encodeURIComponent(parentFilter)}`
          );
          if (!responseParent.ok) throw new Error(`Failed to fetch parent data for ${parentKey}`);

          const parentResult = await responseParent.json();
          parentData[parentKey] = parentResult.data;
          console.log(`Fetched Parent Data (${parentKey}):`, parentData[parentKey]);
        }
      }

      // 4. Replace Placeholders in Inputs
      processedTemplate.inputs = replacePlaceholders(
        processedTemplate.inputs,
        orderData.inputFields,
        parentData
      );

      console.log(`Processed Inputs for ${resource.name}:`, processedTemplate.inputs);

      // At this point, you can send the final processed inputs to the respective API
      // Example: await callResourceAPI(processedTemplate.api, processedTemplate.inputs);
    }
  } catch (err) {
    console.error("Error processing order:", err);
  }

  return new Response(
    JSON.stringify({
      message: `Your Order with ID ${id} is submitted`,
      id: id
    }),
    { status: 201 }
  );
}

// Helper Function to Replace Placeholders in Inputs
function replacePlaceholders(inputs, inputFields, parentData) {
  const replaceValues = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === "object") {
        replaceValues(obj[key]); // Recursively process nested objects
      } else if (typeof obj[key] === "string") {
        // Replace inputFields placeholders
        if (obj[key].startsWith("inputFields.")) {
          const fieldName = obj[key].replace("inputFields.", "");
          if (inputFields[fieldName] !== undefined) {
            obj[key] = inputFields[fieldName];
          }
        }
        // Replace parent placeholders like "vpc.VpcId"
        else if (obj[key].includes(".")) {
          const [parentKey, parentField] = obj[key].split(".");
          console.log("Parent Key:", parentKey, "Parent Field:", parentField);
        
          // Always look in the outputs block
          if (
            parentData[parentKey] &&
            parentData[parentKey].outputs &&
            parentData[parentKey].outputs[parentField] !== undefined
          ) {
            obj[key] = parentData[parentKey].outputs[parentField];
            console.log(`Replaced with parent outputs value: ${parentKey}.outputs.${parentField} -> ${obj[key]}`);
          } else {
            console.warn(`Parent placeholder not found: ${parentKey}.outputs.${parentField}`);
          }
        }
        
      }
    }
  };

  replaceValues(inputs);
  return inputs;
}
