export const runtime = "nodejs";

export async function POST(req) {
    try {
      const body = await req.json();
      const { orderID, parentName } = body;
      console.log("Received data:", orderID, parentName);
  
      if (!orderID || !parentName) throw new Error("Order ID and Parent Name are required");
  
      const filter = JSON.stringify({ orderID: orderID, name: parentName });
      const response = await fetch(
        `http://localhost:3000/api/crud?collectionName=jobs&filter=${encodeURIComponent(filter)}`
      );
  
      if (!response.ok) throw new Error("Failed to fetch parent data");
  
      const parentDetails = await response.json();
      console.log("Parent details:", parentDetails);
  
      return new Response(JSON.stringify({ success: true, parentDetails }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }
  }