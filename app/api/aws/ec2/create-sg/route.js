import {
    EC2Client,
    CreateSecurityGroupCommand,
    AuthorizeSecurityGroupIngressCommand,
    AuthorizeSecurityGroupEgressCommand,
  } from "@aws-sdk/client-ec2";
  
  /**
   * Main function to handle POST requests
   */
  export async function POST(req) {
    try {
      const body = await req.json();
      console.log("Received POST request to create Security Group:", body);
  
      const { region, inputs, name } = body;
      const { VpcId, groupName, description, ingressRules, egressRules } = inputs || {};
  
      // Validate required fields
      validateRequestFields({ region, VpcId, groupName, description });
  
      // Initialize EC2 client
      const ec2Client = initializeEC2Client(region);
  
      // Create Security Group
      const securityGroupId = await createSecurityGroup(ec2Client, VpcId, groupName, description);
  
      // Add Ingress Rules
      await addIngressRules(ec2Client, securityGroupId, ingressRules);
  
      // Add Egress Rules
      await addEgressRules(ec2Client, securityGroupId, egressRules);
  
      // Return success response
      return sendResponse(200, {
        success: true,
        message: "Security Group created successfully",
        SecurityGroupId: securityGroupId,
        name,
      });
    } catch (error) {
      console.error("Error creating Security Group:", error.message || error);
      return sendResponse(500, {
        success: false,
        error: "Failed to create Security Group",
        details: error.message || "Internal Server Error",
      });
    }
  }
  
  /**
   * Validate required fields in the request
   */
  function validateRequestFields({ region, VpcId, groupName, description }) {
    const missingFields = [];
    if (!region) missingFields.push("region");
    if (!VpcId) missingFields.push("VpcId");
    if (!groupName) missingFields.push("groupName");
    if (!description) missingFields.push("description");
  
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
   * Create a Security Group
   */
  async function createSecurityGroup(ec2Client, vpcId, groupName, description) {
    const params = {
      GroupName: groupName,
      Description: description,
      VpcId: vpcId,
    };
  
    console.log("Creating Security Group with parameters:", params);
  
    try {
      const command = new CreateSecurityGroupCommand(params);
      const result = await ec2Client.send(command);
  
      console.log("Security Group created with GroupId:", result.GroupId);
      return result.GroupId;
    } catch (error) {
      console.error("AWS SDK Error during Security Group creation:", error.message || error);
      throw new Error("AWS SDK failed to create Security Group");
    }
  }
  
  /**
   * Add Ingress (Inbound) Rules
   */
  async function addIngressRules(ec2Client, securityGroupId, ingressRules) {
    try {
      if (ingressRules && ingressRules.length > 0) {
        const ingressParams = {
          GroupId: securityGroupId,
          IpPermissions: ingressRules,
        };
        console.log("Adding ingress rules:", ingressParams);
  
        const ingressCommand = new AuthorizeSecurityGroupIngressCommand(ingressParams);
        await ec2Client.send(ingressCommand);
  
        console.log("Ingress rules added successfully");
      }
    } catch (error) {
      if (error.name === "InvalidPermission.Duplicate") {
        console.log("Ingress rule already exists. Skipping addition.");
      } else {
        throw error;
      }
    }
  }
  
  /**
   * Add Egress (Outbound) Rules
   */
  async function addEgressRules(ec2Client, securityGroupId, egressRules) {
    try {
      if (egressRules && egressRules.length > 0) {
        const egressParams = {
          GroupId: securityGroupId,
          IpPermissions: egressRules,
        };
        console.log("Adding egress rules:", egressParams);
  
        const egressCommand = new AuthorizeSecurityGroupEgressCommand(egressParams);
        await ec2Client.send(egressCommand);
  
        console.log("Egress rules added successfully");
      }
    } catch (error) {
      if (error.name === "InvalidPermission.Duplicate") {
        console.log("Egress rule already exists. Skipping addition.");
      } else {
        throw error;
      }
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
  