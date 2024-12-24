export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received data:", body);
    const { orderID, region, name, type, inputs, status = "created" } = body;

    if (!orderID || !name || !type || !inputs || !region) {
      throw new Error("Missing required fields: orderID, region, name, type, inputs");
    }

    const createdAt = new Date().toISOString();
    const job = {
      orderID,
      region,
      name,
      type,
      status,
      inputs,
      createdAt,
      updatedAt: createdAt,
    };

    // Save job to the database (mocked here)
    const response = await fetch("http://localhost:3000/api/crud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectionName: "jobs",
          job,
        }),
      });
    
    const res = await response.json();
    console.log("Creating jobs:", res);

    return new Response(JSON.stringify({ success: true, "id": res.id || "" }), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
  } catch (err) {
    console.error("Job creation error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
