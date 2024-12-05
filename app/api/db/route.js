export const runtime = "nodejs"; // Ensure server-side runtime

// POST /api/aws/create-resources
export async function POST(req) {
  const body = await req.json();
  console.log("Received data:", body);
  const { selectedFirstOption, selectedSecondSetOption } = body;
  console.log("Parsed data:", selectedSecondSetOption, selectedFirstOption);
  if (!selectedFirstOption || !selectedSecondSetOption ) {
    return new Response(
      JSON.stringify({ error: "Invalid request payload" }),
      { status: 400 }
    );
  }



      // Return success response
  return new Response(
    JSON.stringify({
      message: "All resources created successfully",
      }),
      { status: 201 }
      );
}