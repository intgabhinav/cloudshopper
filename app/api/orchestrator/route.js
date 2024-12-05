export const runtime = "nodejs"; // Ensure server-side runtime
import { connectToDatabase } from '../../../lib/mongodb';

export async function POST(req) {
    const body = await req.json();
    console.log("Received data:", body);
  //   const { bundle, plan } = body;
  //   if (!bundle || !plan) {
  //     return new Response(
  //       JSON.stringify({ error: "Invalid request payload" }),
  //       { status: 400 }
  //     );
  //   }

  //   const db = await connectToDatabase();

  //   const data = await db
  //   .collection('builder')
  //   .find({
  //   $and: [
  //     { bundle: bundle }, // First condition
  //     { plan: plan }, // Second condition
  //   ],
  // })
  // .toArray();
    
  //   console.log("Query result:", data);
  //   if (data.length === 0) {
  //     return new Response('Option not found', { status: 404 });
  //   }
  
    // Return the data as JSON
    return new Response(JSON.stringify(body), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  