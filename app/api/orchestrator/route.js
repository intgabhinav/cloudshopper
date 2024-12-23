export const runtime = "nodejs"; // Ensure server-side runtime

function resolvePlaceholder(placeholder, parentDetails) {
  const [parentType, ...pathParts] = placeholder.split(".");
  if (parentDetails?.type === parentType) {
    let resolvedValue = parentDetails;
    for (const path of pathParts) {
      resolvedValue = resolvedValue?.[path];
    }
    return resolvedValue;
  }
  return undefined;
}

export async function POST(req) {
  const body = await req.json();
  const { orderID } = body;
  console.log("01 Received data:", orderID, body);

  try {
    // Fetch the order details using the orderID
    const filter = JSON.stringify({ _id: orderID });
    const responseOrder = await fetch(
      `http://localhost:3000/api/crud?collectionName=orders&filter=${encodeURIComponent(filter)}`
    );
    if (!responseOrder.ok) throw new Error("Failed to fetch order data");

    const resultOrder = await responseOrder.json();
    const { resources } = resultOrder;
    console.log("02 Fetched order details:", resultOrder);

    for (const resource of resources) {
      console.log(
        `03 Processing resource: ${resource.name} (${resource.type}), resultOrder:`,
        resources
      );

      // Process parent relationships
      if (resource.parent && Array.isArray(resource.parent)) {
        console.log(
          `04 Processing multiple parents for resource ${resource.name}, parent:`,
          resource.parent
        );
        for (const parent of resource.parent) {
          console.log(`05 Processing parent: ${parent}`);
          // Fetch parent details using the parent name
          const filterJob = JSON.stringify({
            "orderID": orderID,
            "name": parent,
          });
          const responseParent = await fetch(
            `http://localhost:3000/api/crud?collectionName=jobs&filter=${encodeURIComponent(filterJob)}`
          );
          if (!responseParent.ok) throw new Error("Failed to fetch parent data");
          const resultParent = await responseParent.json();
          const parentDetails = resultParent;

          if (!resultParent) {
            console.error("Parent details not found or invalid structure:", resultParent);
            continue; // Skip this parent if no details are found
          }

          // Fetch the resource template
          const filterResource = JSON.stringify({ type: resource.type });
          const responseResource = await fetch(
            `http://localhost:3000/api/crud?collectionName=resources&filter=${encodeURIComponent(filterResource)}`
          );
          if (!responseResource.ok) throw new Error("Failed to fetch resource template");

          const resourceTemplate = await responseResource.json();
          console.log("07 Fetched resource template:", resourceTemplate);

          const resolvedInputs = {};
          for (const [key, value] of Object.entries(resourceTemplate.inputs)) {
            if (typeof value === "string" && value.startsWith("{{") && value.endsWith("}}")) {
              const placeholder = value.slice(2, -2); // Remove {{ and }}
              const resolvedValue = resolvePlaceholder(placeholder, parentDetails);

              if (resolvedValue === undefined) {
                console.error(
                  `Failed to resolve placeholder ${value} for resource ${resource.name}. Parent details:`,
                  JSON.stringify(parentDetails, null, 2)
                );
              }
              resolvedInputs[key] = resolvedValue;
            } else {
              resolvedInputs[key] = value;
            }
          }

          console.log(`Resolved inputs for resource ${resource.name}:`, resolvedInputs);

          // Example: Using resolved inputs to call a resource API
          // try {
          //   const resourceResponse = await fetch(resourceTemplate.api, {
          //     method: "POST",
          //     headers: { "Content-Type": "application/json" },
          //     body: JSON.stringify(resolvedInputs),
          //   });
          //   if (!resourceResponse.ok) {
          //     console.error(`Failed to create resource ${resource.name}:`, await resourceResponse.text());
          //   } else {
          //     console.log(`Resource ${resource.name} created successfully.`);
          //   }
          // } catch (apiError) {
          //   console.error(`Error creating resource ${resource.name}:`, apiError);
          // }
        }
      }
    }
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }

  console.log("09 Processing completed");
  return new Response(
    JSON.stringify({ success: true, message: "All resources processed successfully" }),
    { headers: { "Content-Type": "application/json" }, status: 200 }
  );
}
