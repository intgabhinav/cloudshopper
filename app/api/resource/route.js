export const runtime = "nodejs"; 

export async function POST(req) {
    const body = await req.json();
    const {  id } = body;
    console.log("Received data:", body.id, body);

    try {
      const filter = JSON.stringify({ _id: id });
      const responseOrder = await fetch(`http://localhost:3000/api/crud?collectionName=orders&filter=${encodeURIComponent(filter)}`);
      if (!responseOrder.ok) throw new Error("Failed to fetch data");

      const resultOrder = await responseOrder.json();
      //console.log("resultOrder:" , resultOrder);
      const resourcesOrder = resultOrder.data.data.resources;
      for (const item of resourcesOrder) {
        //const response = await processResources(result.data.data.region, item);
        const filter = JSON.stringify({ type: item.type });
        const responseResources = await fetch(`http://localhost:3000/api/crud?collectionName=resources&filter=${encodeURIComponent(filter)}`);
        if (!responseResources.ok) throw new Error("Failed to fetch data");
        
        const resultResources = await responseResources.json();
        console.log("resultResources:" , resultResources);
        replacePlaceholders(resultResources, resultOrder.data.data.inputFields);

        await fetch("http://localhost:3000/api/orchestrator", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({id: id, region: resultOrder.data.data.region, resource:resultResources} ),
        })     
      }      
    } catch (err) {
      console.error("Error fetching data:", err);
      //setError(err.message || "An unexpected error occurred");
    }
  
    return new Response(
      JSON.stringify({ message: "Your Order with ID " + id + " is submitted" , "id" : id }),
      { status: 201 }
    )
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
  