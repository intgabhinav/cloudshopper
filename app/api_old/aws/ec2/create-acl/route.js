import {
    EC2Client,
    CreateNetworkAclCommand,
    CreateNetworkAclEntryCommand,
    AssociateNetworkAclCommand,
  } from "@aws-sdk/client-ec2";
  
  /**
   * Main function to handle POST requests for creating ACLs
   */
  export async function POST(req) {
    try {
      const body = await req.json();
      console.log("Received POST request for ACL creation:", body);
  
      // Extract region and inputs
      const { region, inputs } = body;
      const { VpcId, SubnetId, AclEntries } = inputs || {};
  
      // Validate request fields
      validateRequestFields({ region, VpcId, SubnetId, AclEntries });
  
      // Initialize EC2 Client
      const ec2Client = new EC2Client({ region });
  
      // Step 1: Create Network ACL
      const aclResult = await createNetworkAcl(ec2Client, VpcId);
  
      // Step 2: Add entries to the Network ACL
      await addEntriesToAcl(ec2Client, aclResult.NetworkAcl.NetworkAclId, AclEntries);
  
      // Step 3: Associate ACL with Subnet
      await associateAclWithSubnet(ec2Client, aclResult.NetworkAcl.NetworkAclId, SubnetId);
  
      // Return success response
      return sendResponse(200, {
        success: true,
        message: "Network ACL created and associated successfully",
        AclId: aclResult.NetworkAcl.NetworkAclId,
        details: aclResult.NetworkAcl,
      });
    } catch (error) {
      console.error("Error creating ACL:", error.message || error);
      return sendResponse(500, {
        success: false,
        error: "Failed to create ACL",
        details: error.message || "Internal Server Error",
      });
    }
  }
  
  /**
   * Validate required fields in the request
   */
  function validateRequestFields({ region, VpcId, SubnetId, AclEntries }) {
    const missingFields = [];
    if (!region) missingFields.push("region");
    if (!VpcId) missingFields.push("VpcId");
    if (!SubnetId) missingFields.push("SubnetId");
    if (!AclEntries || !Array.isArray(AclEntries)) missingFields.push("AclEntries");
  
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }
  }
  
  /**
   * Create a Network ACL using CreateNetworkAclCommand
   */
  async function createNetworkAcl(ec2Client, vpcId) {
    const params = { VpcId: vpcId };
  
    console.log("Creating Network ACL with params:", params);
  
    try {
      const command = new CreateNetworkAclCommand(params);
      const result = await ec2Client.send(command);
  
      console.log("Network ACL Created Successfully:", result.NetworkAcl);
      return result;
    } catch (error) {
      console.error("AWS SDK Error during Network ACL creation:", error.message || error);
      throw new Error("AWS SDK failed to create Network ACL");
    }
  }
  
  /**
   * Add entries to a Network ACL using CreateNetworkAclEntryCommand
   */
  async function addEntriesToAcl(ec2Client, aclId, aclEntries) {
    for (const entry of aclEntries) {
      const params = {
        NetworkAclId: aclId,
        RuleNumber: entry.RuleNumber,
        Protocol: entry.Protocol,
        RuleAction: entry.RuleAction,
        Egress: entry.Egress,
        CidrBlock: entry.CidrBlock,
        PortRange: entry.PortRange,
      };
  
      console.log("Adding entry to ACL with params:", params);
  
      try {
        const command = new CreateNetworkAclEntryCommand(params);
        await ec2Client.send(command);
  
        console.log(`Entry added to ACL ${aclId} with RuleNumber ${entry.RuleNumber}`);
      } catch (error) {
        console.error("AWS SDK Error during ACL entry creation:", error.message || error);
        throw new Error(`AWS SDK failed to add entry to ACL with RuleNumber ${entry.RuleNumber}`);
      }
    }
  }
  
  /**
   * Associate a Network ACL with a Subnet using AssociateNetworkAclCommand
   */
  async function associateAclWithSubnet(ec2Client, networkAclId, subnetId) {
    const params = {
      NetworkAclId: networkAclId,
      SubnetId: subnetId,
    };
  
    console.log("Associating ACL with Subnet with params:", params);
  
    try {
      const command = new AssociateNetworkAclCommand(params);
      const result = await ec2Client.send(command);
      console.log(`ACL ${networkAclId} associated with Subnet ${subnetId}`);
      return result;
    } catch (error) {
      console.error(`AWS SDK Error during ACL association: ${error.message || error}`);
      throw new Error(`AWS SDK failed to associate ACL ${networkAclId} with Subnet ${subnetId}`);
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
  