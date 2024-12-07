import { connectToDatabase } from '../../../lib/mongodb';
export const runtime = "nodejs"; // Ensure server-side runtime

export async function POST(req) {
  try {
    const body = await req.json();
    const { bundle, plan, inputFields } = body;

    // Validate the payload
    if (!bundle || !plan || !inputFields) {
      return new Response(
        JSON.stringify({ error: "Invalid request payload" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const db = await connectToDatabase();

    // Find data matching the `bundle` and `plan`
    const data = await db
      .collection('builder')
      .find({ $and: [{ bundle: bundle }, { plan: plan }] })
      .toArray();

    if (data.length === 0) {
      return new Response('Option not found', { status: 404 });
    }

    let insertedIds = []; // To keep track of inserted IDs
    for (const item of data) {
      const replace = generateReplacements(item, inputFields);
      const updatedResources = replacePlaceholders(item, replace);

      const order = await fetch("http://localhost:3000/api/store-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resources: updatedResources }),
      });

      const orderResponse = await order.json();
      console.log(orderResponse.id);
      if (orderResponse?.id) {
        insertedIds.push(orderResponse.id); // Collect the inserted ID
      }
    }

    // Return the first ID (if relevant) or all inserted IDs
    if (insertedIds.length > 0) {
      return new Response(
        JSON.stringify({ ids: insertedIds }),
        { headers: { "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Failed to store data" }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in /api/builder:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

function replacePlaceholders(template, replacements) {
  const replaceValues = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === "object") {
        replaceValues(obj[key]); // Recursively process nested objects
      } else if (typeof obj[key] === "string" && obj[key].startsWith("inputFields.")) {
        const fieldName = obj[key].replace("inputFields.", ""); // Extract the key (e.g., "bucketName")
        if (replacements[fieldName] !== undefined) {
          obj[key] = replacements[fieldName]; // Replace with the corresponding value
        }
      }
    }
  };

  replaceValues(template);
  return template;
}

function generateReplacements(template, body) {
  const replacements = {};
  const extractPlaceholders = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === "object") {
        extractPlaceholders(obj[key]); // Recursively process nested objects
      } else if (typeof obj[key] === "string" && obj[key].startsWith("inputFields.")) {
        const fieldName = obj[key].replace("inputFields.", ""); // Extract the field name
        if (body[fieldName] !== undefined) {
          replacements[fieldName] = body[fieldName]; // Add to replacements if it exists in `body`
        }
      }
    }
  };

  extractPlaceholders(template);
  return replacements;
}
