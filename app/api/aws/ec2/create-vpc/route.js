import { EC2Client, CreateVpcCommand } from "@aws-sdk/client-ec2";

/**
 * Main function to handle POST requests
 */
export async function POST(req) {
  const body = await req.json();

  // Extract fields
  const { id, region, CidrBlock, name } = body;

  try {
    // Validate request fields
    validateRequestFields({ id, region, CidrBlock, name });

    // Initialize EC2 Client
    const ec2Client = initializeEC2Client(region);

    // Create VPC using CreateVpcCommand
    const result = await createVPC(ec2Client, CidrBlock, name);

    // Return success response
    return sendResponse(200, {
      message: "VPC created successfully",
      VpcId: result.Vpc.VpcId,
      details: result.Vpc,
    });
  } catch (error) {
    // Log and return error
    console.error("Error:", error.message || error);
    return sendResponse(500, {
      error: "Failed to create VPC",
      details: error.message || "Internal Server Error",
    });
  }
}

/**
 * Validate required fields in the request
 */
function validateRequestFields({ id, region, CidrBlock, name }) {
  const missingFields = [];
  if (!id) missingFields.push("id");
  if (!region) missingFields.push("region");
  if (!CidrBlock) missingFields.push("CidrBlock");
  if (!name) missingFields.push("name");

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }
}

/**
 * Initialize EC2 Client with the specified region
 */
function initializeEC2Client(region) {
  return new EC2Client({ region });
}

/**
 * Create a VPC using CreateVpcCommand
 */
async function createVPC(ec2Client, CidrBlock, name) {
  const params = {
    CidrBlock,
    TagSpecifications: [
      {
        ResourceType: "vpc",
        Tags: [{ Key: "Name", Value: name }],
      },
    ],
  };

  console.log("Creating VPC with params:", params);

  const command = new CreateVpcCommand(params);
  const result = await ec2Client.send(command);

  console.log("VPC Created Successfully:", result.Vpc);
  return result;
}

/**
 * Helper to send JSON responses
 */
function sendResponse(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
