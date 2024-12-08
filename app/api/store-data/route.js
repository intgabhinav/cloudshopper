import { connectToDatabase } from "@/lib/mongodb"; // Update the path if necessary
import { ObjectId } from "mongodb";


// Handle POST request: Save data to the database

export async function POST(req) {
  try {
    const body = await req.json();
    const db = await connectToDatabase();
    let orderid;
    // Insert data into the "records" collection
    const result = await db.collection("records").insertOne(body);
    orderid = result.insertedId.toString();
    console.log("Inserted data with ID:", orderid);
    // Return the newly generated ObjectId as part of the response
    return new Response(
        JSON.stringify({ id: orderid }),
        //orderid,
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error inserting data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to insert data" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}

// Handle GET request: Fetch data by ID
export async function GET(req) {
  const db = await connectToDatabase();
  const collection = db.collection("records");

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "ID not provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await collection.findOne({ _id: new ObjectId(id) }); // Find by ID
    if (!data) {
      return new Response(JSON.stringify({ error: "Data not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
