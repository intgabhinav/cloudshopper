import {
  EC2Client,
  RunInstancesCommand,
  CreateTagsCommand,
} from "@aws-sdk/client-ec2";

/**
 * Main function to handle POST requests
 */
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received POST request to create EC2 Instance:", body);

    const { region, inputs, name } = body;
    const {
      ImageId,
      InstanceType,
      KeyName,
      SecurityGroupIds,
      SubnetId,
      TagSpecifications,
    } = inputs || {};

    // Validate required fields
    validateRequestFields({
      region,
      ImageId,
      InstanceType,
      SubnetId,
      SecurityGroupIds,
    });

    // Initialize EC2 client
    const ec2Client = initializeEC2Client(region);

    // Create EC2 Instance
    const instanceId = await createEC2Instance(ec2Client, {
      ImageId,
      InstanceType,
      KeyName,
      SecurityGroupIds,
      SubnetId,
      TagSpecifications,
    });

    // Return success response
    return sendResponse(200, {
      success: true,
      message: "EC2 Instance created successfully",
      InstanceId: instanceId,
      name,
    });
  } catch (error) {
    console.error("Error creating EC2 Instance:", error.message || error);
    return sendResponse(500, {
      success: false,
      error: "Failed to create EC2 Instance",
      details: error.message || "Internal Server Error",
    });
  }
}

/**
 * Validate required fields in the request
 */
function validateRequestFields({
  region,
  ImageId,
  InstanceType,
  SubnetId,
  SecurityGroupIds,
}) {
  const missingFields = [];
  if (!region) missingFields.push("region");
  if (!ImageId) missingFields.push("ImageId");
  if (!InstanceType) missingFields.push("InstanceType");
  if (!SubnetId) missingFields.push("SubnetId");
  if (!SecurityGroupIds || SecurityGroupIds.length === 0)
    missingFields.push("SecurityGroupIds");

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
 * Create EC2 Instance
 */
async function createEC2Instance(ec2Client, params) {
  console.log("Creating EC2 Instance with parameters:", params);

  try {
    const command = new RunInstancesCommand({
      ImageId: params.ImageId,
      InstanceType: params.InstanceType,
      KeyName: params.KeyName,
      SecurityGroupIds: params.SecurityGroupIds,
      SubnetId: params.SubnetId,
      MinCount: 1,
      MaxCount: 1,
      TagSpecifications: params.TagSpecifications || [],
    });

    const result = await ec2Client.send(command);

    const instanceId = result.Instances[0].InstanceId;
    console.log("EC2 Instance created with InstanceId:", instanceId);

    return instanceId;
  } catch (error) {
    console.error("AWS SDK Error during EC2 Instance creation:", error.message || error);
    throw new Error("AWS SDK failed to create EC2 Instance");
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
