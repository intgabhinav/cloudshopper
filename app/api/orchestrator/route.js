export const runtime = "nodejs";

export async function POST(req) {
  const body = await req.json();
  const { id } = body; // Order ID
  console.log("Received Order ID:", id);

try{
      // 1. Fetch the Order by ID
      const filter = JSON.stringify({ _id: id });
      const responseOrder = await fetch(
        `http://localhost:3000/api/crud?collectionName=orders&filter=${encodeURIComponent(filter)}`
      );
      if (!responseOrder.ok) throw new Error("Failed to fetch order data");
  
      const resultOrder = await responseOrder.json();
      const dataOrder = resultOrder.data.data;
  
      console.log("Fetched Order Data:", resultOrder);

}catch(err){
  console.error("Error handling POST request:", err);
  return new Response(
    JSON.stringify({ success: false, error: err.message }),
    { headers: { "Content-Type": "application/json" }, status: 500 }
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
