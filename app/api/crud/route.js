import {
  createRecord,
  readRecord,
  updateRecord,
  deleteRecord,
} from "@/lib/crud";

export const runtime = "nodejs"; // Ensure server-side runtime

// Handle POST requests for creating records
export async function POST(req) {
  try {
    const body = await req.json();
    const { collectionName, job, ...data } = body;

    console.log("Received POST request:", body);
    const timestamps = {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Flatten job object by spreading its properties directly into the data object
    const flattenedData = {
      ...job,  // All properties from the 'job' object
      ...data,  // Additional properties from the request body (if any)
      ...timestamps,  // Add timestamps
    };

    const result = await createRecord(collectionName, flattenedData);

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

// Other methods (GET, PUT, DELETE) remain generic and reusable as written before.


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
      JSON.stringify(result),
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

    // if (!body.collectionName || !body.filter || !body.data) {
    //   throw new Error("Invalid request: Missing required fields");
    // }

    // Ensure filter is an object
    // if (typeof body.filter === "string") {
    //   body.filter = JSON.parse(body.filter);
    // }
    const { collectionName, filter, ...updateData } = body;
    const timestamps = { updatedAt: new Date().toISOString() };
    const result = await updateRecord(collectionName, filter, { ...updateData, ...timestamps });
    

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
