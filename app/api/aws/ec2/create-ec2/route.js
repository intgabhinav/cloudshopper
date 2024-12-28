import { EC2Client, RunInstancesCommand } from "@aws-sdk/client-ec2";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received POST request to create EC2 instance:", body);

    // Extract necessary inputs
    const { region, instanceDetails } = body;
    const { ImageId, InstanceType, KeyName, SecurityGroupIds, SubnetId, MinCount, MaxCount } = instanceDetails;

    // Validate required fields
    validateInstanceFields({ region, ImageId, InstanceType, MinCount, MaxCount });

    // Initialize EC2 Client
    const ec2Client = new EC2Client({ region });

    // Set up parameters for creating the instance
    const params = {
      ImageId,
      InstanceType,
      KeyName,
      SecurityGroupIds,
      SubnetId,
      MinCount,
      MaxCount,
    };

    console.log("Creating EC2 instance with parameters:", params);

    // Create the EC2 instance
    const command = new RunInstancesCommand(params);
    const response = await ec2Client.send(command);

    console.log("EC2 instance created successfully:", response.Instances);

    return sendResponse(200, {
      success: true,
      message: "EC2 instance created successfully",
      instanceDetails: response.Instances,
    });
  } catch (error) {
    console.error("Error creating EC2 instance:", error.message || error);
    return sendResponse(500, {
      success: false,
      error: "Failed to create EC2 instance",
      details: error.message || "Internal Server Error",
    });
  }
}

/**
 * Validate required fields for EC2 instance creation
 */
function validateInstanceFields({ region, ImageId, InstanceType, MinCount, MaxCount }) {
  const missingFields = [];
  if (!region) missingFields.push("region");
  if (!ImageId) missingFields.push("ImageId");
  if (!InstanceType) missingFields.push("InstanceType");
  if (!MinCount) missingFields.push("MinCount");
  if (!MaxCount) missingFields.push("MaxCount");

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
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
