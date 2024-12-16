import { createRecord, readRecord, updateRecord, deleteRecord } from "@/lib/crud";

export const runtime = "nodejs"; // Ensure server-side runtime

// Handle POST requests for creating records
export async function POST(req) {
  try {
    const body = await req.json();
    //console.log("Received data CRUD POST:", body.data);
    const result = await createRecord(body.collectionName, body.data);

    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      { headers: { "Content-Type": "application/json" }, status: 201 }
    );
  } catch (error) {
    console.error("Error handling POST request:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
}

// Handle GET requests for reading records
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const collectionName = searchParams.get("collectionName");
    const filter = JSON.parse(searchParams.get("filter"));

    const result = await readRecord(collectionName, filter);

    if (!result) {
      return new Response(
        JSON.stringify({ success: false, message: "Record not found" }),
        { headers: { "Content-Type": "application/json" }, status: 404 }
      );
    }

    return new Response(
      JSON.stringify({  data: result }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error handling GET request:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
}

// Handle PUT requests for updating records
export async function PUT(req) {
  try {
    const body = await req.json();
    console.log("Received PUT request:", body);

    if (!body.collectionName || !body.filter || !body.data) {
      throw new Error("Invalid request: Missing required fields");
    }

    // Ensure filter is an object
    if (typeof body.filter === "string") {
      body.filter = JSON.parse(body.filter);
    }

    const result = await updateRecord(body.collectionName, body.filter, body.data);

    return new Response(
      JSON.stringify({
        success: true,
        modifiedCount: result.modifiedCount,
      }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error handling PUT request:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
}


// Handle DELETE requests for deleting records
export async function DELETE(req) {
  try {
    const { collectionName, filter } = await req.json();
    const result = await deleteRecord(collectionName, filter);

    return new Response(
      JSON.stringify({
        success: true,
        deletedCount: result.deletedCount,
      }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error handling DELETE request:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
}
