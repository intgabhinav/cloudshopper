import { EC2Client, CreateSubnetCommand } from "@aws-sdk/client-ec2";

/**
 * Main function to handle POST requests for creating a subnet
 */
export async function POST(req) {
  const body = await req.json();

  // Extract fields
  const { region, VpcId, CidrBlock } = body;

  try {
    // Validate request fields
    validateRequestFields({ region, VpcId, CidrBlock });

    // Initialize EC2 Client
    const ec2Client = initializeEC2Client(region);

    // Create Subnet using CreateSubnetCommand
    const result = await createSubnet(ec2Client, VpcId, CidrBlock);

    // Return success response
    return sendResponse(200, {
      message: "Subnet created successfully",
      SubnetId: result.Subnet.SubnetId,
      details: result.Subnet,
    });
  } catch (error) {
    // Log and return error
    console.error("Error:", error.message || error);
    return sendResponse(500, {
      error: "Failed to create Subnet",
      details: error.message || "Internal Server Error",
    });
  }
}

/**
 * Validate required fields in the request
 */
function validateRequestFields({ region, VpcId, CidrBlock }) {
  const missingFields = [];
  if (!region) missingFields.push("region");
  if (!VpcId) missingFields.push("VpcId");
  if (!CidrBlock) missingFields.push("CidrBlock");

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
 * Create a Subnet using CreateSubnetCommand
 */
async function createSubnet(ec2Client, VpcId, CidrBlock) {
  const params = {
    VpcId,
    CidrBlock,
    TagSpecifications: [
      {
        ResourceType: "subnet",
        Tags: [{ Key: "Name", Value: "name" }],
      },
    ],
  };

  console.log("Creating Subnet with params:", params);

  const command = new CreateSubnetCommand(params);
  const result = await ec2Client.send(command);

  console.log("Subnet Created Successfully:", result.Subnet);
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
