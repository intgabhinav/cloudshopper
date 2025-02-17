import { connectToDatabase } from "@/lib/mongodb";
export const runtime = "nodejs"; // Ensure server-side runtime
import { ObjectId } from "mongodb";

export async function POST(req) {

  try {
    const body = await req.json();
    const { orderID } = body;


    const orderResponse = await fetch(`http://localhost:3000/api/order?orderID=${orderID}`);
    if (!orderResponse.ok) throw new Error("Failed to fetch order details");
    const { order } = await orderResponse.json();


    const db = await connectToDatabase();

    // Find data matching the `bundle` and `plan`
    const filter = { 
      "bundle": order.bundle, 
      "plan": order.plan 
    };
    const data = await db
      .collection('builderv2')
      .find(filter)
      .toArray();
    // To-Do: Limit data.length to 1 and only 1. 
    if (data.length === 0) {
      return new Response('Option not found', { status: 404 });
    }
      for (const item of data) {
        const orderfilter = { _id: order._id };
        //const replace = generateReplacements(item, inputFields);
        replacePlaceholders(item, order.inputFields);
        //const response = {"status": "200"};
        const response = await fetch("http://localhost:3000/api/crud", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            collectionName: "orders", // Specify target collection
            filter : orderfilter,
            resources: item.resources


        //     bundle: item.bundle,
        //     plan: item.plan,
        //     region: item.region,
        //     resources: item.resources,
        //     inputFields,
        //     // : {
        //     //   region: inputFields.region,
        //     //   sitename: inputFields.sitename,
        //     //   username: inputFields.username,
        //     //   passwordHash: hashPassword(inputFields.password), // Use a hashing function
        //     // },
            // status: "Review",
          }),
        });
         
      }

    return new Response(
      JSON.stringify({ success: true, message: "Update successfull" }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );



  } catch (error) {
    console.error("Update Error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
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
