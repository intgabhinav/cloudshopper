export const runtime = "nodejs"; // Ensure server-side runtime
import { connectToDatabase } from '../../../lib/mongodb';

export async function POST(req) {
    const body = await req.json();
    console.log("Received data:", body);
  
    // Return the data as JSON
    return new Response(JSON.stringify(body), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  