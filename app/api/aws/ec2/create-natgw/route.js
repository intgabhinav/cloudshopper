import { EC2Client, AllocateAddressCommand, CreateNatGatewayCommand } from "@aws-sdk/client-ec2";

/**
 * Main function to handle POST requests
 */
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received POST request NAT Gateway:", body);

    // Extract region and inputs
    const { region, inputs } = body;
    const { SubnetId, Name } = inputs || {};

    // Validate request fields
    validateRequestFields({ region, SubnetId, Name });

    // Initialize EC2 Client
    const ec2Client = initializeEC2Client(region);

    // Allocate Elastic IP
    const eipResult = await allocateElasticIp(ec2Client);

    // Create NAT Gateway
    const natGatewayResult = await createNatGateway(ec2Client, SubnetId, eipResult.AllocationId, Name);

    // Return success response
    return sendResponse(200, {
      success: true,
      message: "NAT Gateway created successfully",
      NatGatewayId: natGatewayResult.NatGateway.NatGatewayId,
      details: natGatewayResult.NatGateway,
    });
  } catch (error) {
    console.error("Error creating NAT Gateway:", error.message || error);
    return sendResponse(500, {
      success: false,
      error: "Failed to create NAT Gateway",
      details: error.message || "Internal Server Error",
    });
  }
}

/**
 * Validate required fields in the request
 */
function validateRequestFields({ region, SubnetId, Name }) {
  const missingFields = [];
  if (!region) missingFields.push("region");
  if (!SubnetId) missingFields.push("SubnetId");
  if (!Name) missingFields.push("name");

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
 * Allocate an Elastic IP using AllocateAddressCommand
 */
async function allocateElasticIp(ec2Client) {
  try {
    console.log("Allocating Elastic IP...");
    const command = new AllocateAddressCommand({});
    const result = await ec2Client.send(command);

    console.log("Elastic IP Allocated Successfully:", result.AllocationId);
    return result;
  } catch (error) {
    console.error("AWS SDK Error during Elastic IP allocation:", error.message || error);
    throw new Error("AWS SDK failed to allocate Elastic IP");
  }
}

/**
 * Create a NAT Gateway using CreateNatGatewayCommand
 */
async function createNatGateway(ec2Client, subnetId, allocationId, name) {
  const params = {
    SubnetId: subnetId,
    AllocationId: allocationId,
    TagSpecifications: [
      {
        ResourceType: "natgateway",
        Tags: [{ Key: "Name", Value: name }],
      },
    ],
  };

  console.log("Creating NAT Gateway with params:", params);

  try {
    const command = new CreateNatGatewayCommand(params);
    const result = await ec2Client.send(command);

    console.log("NAT Gateway Created Successfully:", result.NatGateway);
    return result;
  } catch (error) {
    console.error("AWS SDK Error during NAT Gateway creation:", error.message || error);
    throw new Error("AWS SDK failed to create NAT Gateway");
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
