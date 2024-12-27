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
    const unresolvedPlaceholders = []; // Track unresolved placeholders
    const parentDetailsMap = {}; // For faster lookup of parent details

    // Create a map of parent types to their details for faster lookup
    parentDetailsArray.forEach(({ details: parentDetails }) => {
      if (parentDetails && parentDetails.type) {
        parentDetailsMap[parentDetails.type] = parentDetails;
      }
    });

    for (const [key, value] of Object.entries(template.inputs)) {
      if (typeof value === "string" && value.startsWith("{{") && value.endsWith("}}")) {
        const placeholder = value.slice(2, -2); // Remove {{ and }}
        const [parentType, ...pathParts] = placeholder.split(".");

        let resolvedValue;

        // First, check if the placeholder refers to inputFields
        if (placeholder.startsWith("inputFields.")) {
          const inputFieldKey = placeholder.slice("inputFields.".length);
          resolvedValue = inputFields[inputFieldKey];  // Look up directly in inputFields
        } else {
          // Check if resource has a parent and try resolving from parent details if parentType exists
          if (parentType) {
            const parentDetails = parentDetailsMap[parentType];
            if (parentDetails) {
              resolvedValue = parentDetails;
              for (const path of pathParts) {
                resolvedValue = resolvedValue?.[path];  // Access nested properties safely
              }
            }
          }

          // If no parent details were found or the parentType was not provided, use fallback (inputFields or null)
          if (resolvedValue === undefined) {
            console.error(`Failed to resolve placeholder '${value}' for input key '${key}'`);
            unresolvedPlaceholders.push({ key, placeholder: value });
            resolvedValue = null; // Fallback to null if unresolved
          }
        }

        resolvedInputs[key] = resolvedValue !== undefined ? resolvedValue : null;
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
