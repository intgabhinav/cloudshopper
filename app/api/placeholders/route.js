export async function POST(req) {
  try {
    const body = await req.json();
    const { template, parentDetailsArray, inputFields } = body;

    console.log("Received data:", template, parentDetailsArray, inputFields);

    if (!template || !parentDetailsArray || !inputFields) {
      throw new Error("Template, Parent Details, and Input Fields are required");
    }

    if (!template.inputs || typeof template.inputs !== "object") {
      throw new Error("Template inputs must be a valid object");
    }

    const resolvedInputs = {};
    const unresolvedPlaceholders = [];
    const parentDetailsMap = {};

    // Create a map of parent types to their details for faster lookup
    parentDetailsArray.forEach(({ details: parentDetails }) => {
      if (parentDetails && parentDetails.type) {
        parentDetailsMap[parentDetails.type] = parentDetails;
      }
    });

    // Log parentDetailsMap to debug
    console.log("Parent Details Map:", parentDetailsMap);

    for (const [key, value] of Object.entries(template.inputs)) {
      if (typeof value === "string" && value.startsWith("{{") && value.endsWith("}}")) {
        const placeholder = value.slice(2, -2); // Remove {{ and }}
        const [parentType, ...pathParts] = placeholder.split(".");

        let resolvedValue;

        // Check if placeholder refers to inputFields
        if (placeholder.startsWith("inputFields.")) {
          const inputFieldKey = placeholder.slice("inputFields.".length);
          resolvedValue = inputFields[inputFieldKey];
        } else if (parentType && pathParts.length > 1 && pathParts[0] === "outputs") {
          // Check parent details for outputs
          const outputKey = pathParts[1]; // Extract "GroupId" from "outputs.GroupId"
          const parentDetails = parentDetailsMap[parentType];

          if (parentDetails && parentDetails.outputs) {
            resolvedValue = parentDetails.outputs[outputKey];
            console.log(`Resolved value for ${placeholder}:`, resolvedValue);
          } else {
            console.error(`Failed to find parent details or outputs for ${parentType}`);
          }
        }

        if (resolvedValue === undefined) {
          console.error(`Failed to resolve placeholder '${value}' for input key '${key}'`);
          unresolvedPlaceholders.push({ key, placeholder: value });
          resolvedValue = null; // Fallback to null if unresolved
        }

        // Wrap SecurityGroupIds in an array if needed
        if (key === "SecurityGroupIds" && resolvedValue !== null) {
          resolvedInputs[key] = [resolvedValue];
        } else {
          resolvedInputs[key] = resolvedValue;
        }
      } else {
        resolvedInputs[key] = value;
      }
    }

    console.log(`Resolved inputs for template ${template.name || 'Unknown'}:`, resolvedInputs);

    return new Response(
      JSON.stringify({
        success: true,
        resolvedInputs,
        unresolvedPlaceholders,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (err) {
    console.error("Error during placeholder resolution:", err.message);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
