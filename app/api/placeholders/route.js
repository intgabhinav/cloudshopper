export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { template, parentDetailsArray } = body;

    console.log("Received data:", template, parentDetailsArray);

    if (!template || !parentDetailsArray) {
      throw new Error("Template and Parent Details are required");
    }

    if (!template.inputs || typeof template.inputs !== "object") {
      throw new Error("Template inputs must be a valid object");
    }

    const resolvedInputs = {};
    const unresolvedPlaceholders = []; // Track unresolved placeholders

    for (const [key, value] of Object.entries(template.inputs)) {
      if (typeof value === "string" && value.startsWith("{{") && value.endsWith("}}")) {
        const placeholder = value.slice(2, -2); // Remove {{ and }}
        const [parentType, ...pathParts] = placeholder.split(".");

        let resolvedValue;
        for (const { details: parentDetails } of parentDetailsArray) {
          if (parentDetails.type === parentType) {
            resolvedValue = parentDetails; // Start with parentDetails
            for (const path of pathParts) {
              resolvedValue = resolvedValue?.[path];
            }
            if (resolvedValue !== undefined) break; // Stop if resolved successfully
          }
        }

        if (resolvedValue === undefined) {
          console.error(`Failed to resolve placeholder '${value}' for input key '${key}'`);
          unresolvedPlaceholders.push({ key, placeholder: value });
        }

        resolvedInputs[key] = resolvedValue;
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
