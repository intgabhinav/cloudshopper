import { EC2Client, CreateInternetGatewayCommand, AttachInternetGatewayCommand } from "@aws-sdk/client-ec2";

/**
 * Main function to handle POST requests
 */
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received POST request IGW:", body);

    // Extract region and inputs
    const { region, inputs } = body;
    const { Name, VpcId } = inputs || {};

    // Validate request fields
    validateRequestFields({ region, Name, VpcId });

    // Initialize EC2 Client
    const ec2Client = initializeEC2Client(region);

    // Create Internet Gateway
    const result = await createInternetGateway(ec2Client, Name);

    // Attach Internet Gateway to VPC
    if (VpcId) {
      await attachInternetGateway(ec2Client, result.InternetGateway.InternetGatewayId, VpcId);
    }

    // Return success response
    return sendResponse(200, {
      success: true,
      message: "Internet Gateway created successfully",
      InternetGatewayId: result.InternetGateway.InternetGatewayId,
      details: result.InternetGateway,
    });
  } catch (error) {
    console.error("Error creating Internet Gateway:", error.message || error);
    return sendResponse(500, {
      success: false,
      error: "Failed to create Internet Gateway",
      details: error.message || "Internal Server Error",
    });
  }
}

/**
 * Validate required fields in the request
 */
function validateRequestFields({ region, Name, VpcId }) {
  const missingFields = [];
  if (!region) missingFields.push("region");
  if (!Name) missingFields.push("name");

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  // VpcId validation (optional but validate if provided)
  if (VpcId && typeof VpcId !== "string") {
    throw new Error("VpcId must be a valid string.");
  }
}

/**
 * Initialize EC2 Client with the specified region
 */
function initializeEC2Client(region) {
  return new EC2Client({ region });
}

/**
 * Create an Internet Gateway using CreateInternetGatewayCommand
 */
async function createInternetGateway(ec2Client, name) {
  const params = {
    TagSpecifications: [
      {
        ResourceType: "internet-gateway",
        Tags: [{ Key: "Name", Value: name }],
      },
    ],
  };

  console.log("Creating Internet Gateway with params:", params);

  try {
    const command = new CreateInternetGatewayCommand(params);
    const result = await ec2Client.send(command);

    console.log("Internet Gateway Created Successfully:", result.InternetGateway);
    return result;
  } catch (error) {
    console.error("AWS SDK Error during Internet Gateway creation:", error.message || error);
    throw new Error("AWS SDK failed to create Internet Gateway");
  }
}

/**
 * Attach an Internet Gateway to a VPC
 */
async function attachInternetGateway(ec2Client, internetGatewayId, vpcId) {
  const params = {
    InternetGatewayId: internetGatewayId,
    VpcId: vpcId,
  };

  console.log("Attaching Internet Gateway to VPC with params:", params);

  try {
    const command = new AttachInternetGatewayCommand(params);
    await ec2Client.send(command);

    console.log(`Internet Gateway ${internetGatewayId} attached to VPC ${vpcId}`);
  } catch (error) {
    console.error("AWS SDK Error during Internet Gateway attachment:", error.message || error);
    throw new Error("AWS SDK failed to attach Internet Gateway to VPC");
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
