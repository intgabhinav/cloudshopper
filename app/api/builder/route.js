import { connectToDatabase } from '../../../lib/mongodb';
export const runtime = "nodejs"; // Ensure server-side runtime


// POST /api/aws/create-resources
export async function POST(req) {
  const body = await req.json();
  const { bundle, plan, inputFields } = body;
  if (!bundle || !plan || !inputFields) {
    return new Response(
      JSON.stringify({ error: "Invalid request payload" }),
      { status: 400 }
    );
  }
  //console.log("Received data:", bundle, plan, inputFields);
  const db = await connectToDatabase();

  const data = await db
  .collection('builder')
  .find({ 
    $and: [
      { bundle: bundle }, 
      { plan: plan }, 
    ],
  })
  .toArray();

  if (data.length === 0) {
    return new Response('Option not found', { status: 404 });
  }

    data.forEach(async (item) => {

   // item.resources.forEach(async (resource) => {
      // console.log(`  Resource Name: ${resource.name}`);
      // console.log(`  API Endpoint: ${resource.api}`);
      // console.log(`  Template ID: ${resource.templateid}`);
      // console.log(`  Replacements: ${JSON.stringify(resource.replacements)}`);
      const replace = generateReplacements(item, inputFields);
      const updatedResources = replacePlaceholders(item, replace);

      const orchestrator = await fetch("http://localhost:3000/api/orchestrator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resources: updatedResources }), // Pass the item.resources,
    });

   // });

    });


  // Return the data as JSON
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
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
//console.log(`Template: ${JSON.stringify(template)} + " " + ${JSON.stringify(body)}`);
  const extractPlaceholders = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === "object") {
        extractPlaceholders(obj[key]); // Recursively process nested objects
      } else if (typeof obj[key] === "string" && obj[key].startsWith("inputFields.")) {
        const fieldName = obj[key].replace("inputFields.", ""); // Extract the field name
        //console.log(`Field Name: ${fieldName}`);
        if (body[fieldName] !== undefined) {
          replacements[fieldName] = body[fieldName]; // Add to replacements if it exists in `body`
        }
      }
    }
  };

  extractPlaceholders(template);
  return replacements;
}
