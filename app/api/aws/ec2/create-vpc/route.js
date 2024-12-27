import { EC2Client, CreateVpcCommand } from "@aws-sdk/client-ec2";

/**
 * Main function to handle POST requests
 */
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received POST request VPC:", body);

    // Extract region and inputs
    const { region, inputs } = body;
    const { CidrBlock, name } = inputs || {};

    // Validate request fields
    validateRequestFields({ region, CidrBlock, name });

    // Initialize EC2 Client
    const ec2Client = initializeEC2Client(region);

    // Create VPC
    const result = await createVPC(ec2Client, CidrBlock, name);

    // Return success response
    return sendResponse(200, {
      success: true,
      message: "VPC created successfully",
      VpcId: result.Vpc.VpcId,
      details: result.Vpc,
    });
  } catch (error) {
    console.error("Error creating VPC:", error.message || error);
    return sendResponse(500, {
      success: false,
      error: "Failed to create VPC",
      details: error.message || "Internal Server Error",
    });
  }
}

/**
 * Validate required fields in the request
 */
function validateRequestFields({ region, CidrBlock, name }) {
  const missingFields = [];
  if (!region) missingFields.push("region");
  if (!CidrBlock) missingFields.push("CidrBlock");
  if (!name) missingFields.push("name");

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  // Additional validation for CidrBlock
  const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
  if (!cidrRegex.test(CidrBlock)) {
    throw new Error("Invalid CidrBlock format. Expected format: '10.0.0.0/16'");
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

  try {
    const command = new CreateVpcCommand(params);
    const result = await ec2Client.send(command);

    console.log("VPC Created Successfully:", result.Vpc);
    return result;
  } catch (error) {
    console.error("AWS SDK Error during VPC creation:", error.message || error);
    throw new Error("AWS SDK failed to create VPC");
  }
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
