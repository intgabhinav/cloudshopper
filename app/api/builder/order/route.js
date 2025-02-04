import { connectToDatabase } from "@/lib/mongodb";
export const runtime = "nodejs"; // Ensure server-side runtime
import { ObjectId } from "mongodb";

export async function POST(req) {
  let id;
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
    const filter = { 
      "bundle": bundle, 
      "plan": plan 
    };
    const data = await db
      .collection('builderv1')
      .find(filter)
      .toArray();

    if (data.length === 0) {
      console.log("Option not found");
      return new Response('Option not found', { status: 404 });
    }
    
    for (const item of data) {
      //const replace = generateReplacements(item, inputFields);
      replacePlaceholders(item, inputFields);
      const response = await fetch("http://localhost:3000/api/crud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectionName: "orders", // Specify target collection
          bundle: item.bundle,
          plan: item.plan,
          region: item.region,
          resources: item.resources,
          inputFields,
          // : {
          //   region: inputFields.region,
          //   sitename: inputFields.sitename,
          //   username: inputFields.username,
          //   passwordHash: hashPassword(inputFields.password), // Use a hashing function
          // },
          status: "Review",
        }),
      });
       const result = await response.json();
       id = result.id;
       
    }
    return new Response(
      JSON.stringify({ id: id }),
      { headers: { "Content-Type": "application/json" } }
    );
      
  } catch (error) {
    console.error("Error in /api/builderv1:", error);
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


function hashPassword(password) {
  return password; // Replace with bcrypt or argon2 hashing logic
}
