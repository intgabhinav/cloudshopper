export const runtime = "nodejs";

export async function GET(req) {

    const { searchParams } = new URL(req.url);
    const orderID = searchParams.get("orderID");
    console.log("Received data:", orderID);

    // Fetch order details logic
    const filter = JSON.stringify({ _id: orderID });
    const response = await fetch(
        `http://localhost:3000/api/crud?collectionName=orders&filter=${encodeURIComponent(filter)}`
        );
    const order = await response.json();
    return new Response(
        JSON.stringify({ success: true, order }),
        { headers: { "Content-Type": "application/json" }, status: 200 }
      );
}
    
