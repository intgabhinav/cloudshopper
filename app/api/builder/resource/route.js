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
    const dataOrder = resultOrder.data.data;

    console.log("Fetched Order Data:", dataOrder);

    // 2. Iterate over Resources
    for (const resource of dataOrder.resources) {
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
        const parentPromises = processedTemplate.parent.map(async (parentObject) => {
          const parentFetches = Object.keys(parentObject).map(async (parentKey) => {
            console.log("Fetching data for parent:", parentKey);

            try {
              const parentFilter = JSON.stringify({
                "data.orderID": id,
                "data.name": parentKey,
              });

              const responseParent = await fetch(
                `http://localhost:3000/api/crud?collectionName=jobs&filter=${encodeURIComponent(parentFilter)}`
              );

              if (!responseParent.ok) {
                throw new Error(`Failed to fetch parent data for ${parentKey}`);
              }

              const resultParent = await responseParent.json();
              console.log(`Fetched Parent Data (${parentKey}):`, resultParent);

              // Store parent data for placeholder replacement
              parentData[parentKey] = resultParent.data;
            } catch (error) {
              console.error(`Error fetching data for parent ${parentKey}:`, error);
            }
          });

          await Promise.all(parentFetches);
        });

        await Promise.all(parentPromises);
      }

      // 4. Replace Placeholders in Inputs
      processedTemplate.inputs = replacePlaceholders(
        processedTemplate.inputs,
        dataOrder.inputFields,
        parentData
      );

      console.log(`Processed Inputs for ${resource.name}:`, processedTemplate);

      // 5. Send Data to the Next API
      const apiResponse = await fetch(`http://localhost:3000/api/orchestrator`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          region: dataOrder.region,
          name: resource.name,
          api: processedTemplate.api,
          processedTemplate,
        }),
      });

      if (!apiResponse.ok) {
        throw new Error(
          `Failed to process resource ${resource.name}: ${apiResponse.statusText}`
        );
      }

      const apiResult = await apiResponse.json();
      console.log(`API Response for ${resource.name}:`, apiResult);
    }
  } catch (err) {
    console.error("Error processing order:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({
      message: `Your Order with ID ${id} is submitted`,
      id: id,
    }),
    { status: 201, headers: { "Content-Type": "application/json" } }
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
            console.log(
              `Replaced with parent outputs value: ${parentKey}.outputs.${parentField} -> ${obj[key]}`
            );
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
