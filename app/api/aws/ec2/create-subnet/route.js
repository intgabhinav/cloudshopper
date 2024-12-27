import { EC2Client, CreateSubnetCommand } from "@aws-sdk/client-ec2";

/**
 * Main function to handle POST requests for creating a subnet
 */
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received POST request SUBNET:", body);

    // Extract region and inputs
    const { region, inputs, name } = body;
    const { VpcId, CidrBlock } = inputs || {};

    // Validate required fields
    validateRequestFields({ region, VpcId, CidrBlock });

    // Initialize EC2 Client
    const ec2Client = initializeEC2Client(region);

    // Create Subnet
    const result = await createSubnet(ec2Client, VpcId, CidrBlock, name);

    // Return success response
    return sendResponse(200, {
      success: true,
      message: "Subnet created successfully",
      SubnetId: result.Subnet.SubnetId,
      details: result.Subnet,
    });
  } catch (error) {
    console.error("Error creating Subnet:", error.message || error);
    return sendResponse(500, {
      success: false,
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

  // Additional validation for CidrBlock
  const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
  if (!cidrRegex.test(CidrBlock)) {
    throw new Error("Invalid CidrBlock format. Expected format: '10.0.0.0/24'");
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
async function createSubnet(ec2Client, VpcId, CidrBlock, name) {
  const params = {
    VpcId,
    CidrBlock,
    TagSpecifications: [
      {
        ResourceType: "subnet",
        Tags: [{ Key: "Name", Value: name || "DefaultSubnetName" }], // Default name if not provided
      },
    ],
  };

  console.log("Creating Subnet with params:", params);

  try {
    const command = new CreateSubnetCommand(params);
    const result = await ec2Client.send(command);
    console.log("Subnet Created Successfully:", result.Subnet);
    return result;
  } catch (error) {
    console.error("AWS SDK Error during Subnet creation:", error.message || error);
    throw new Error("AWS SDK failed to create Subnet");
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
