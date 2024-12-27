import {
    EC2Client,
    CreateRouteTableCommand,
    CreateRouteCommand,
    AssociateRouteTableCommand,
  } from "@aws-sdk/client-ec2";
  
  /**
   * Main function to handle POST requests
   */
  export async function POST(req) {
    try {
      const body = await req.json();
      console.log("Received POST request for Route Table:", body);
  
      // Extract region and inputs
      const { region, inputs } = body;
      const { VpcId, SubnetId, GatewayId, DestinationCidrBlock } = inputs || {};
  
      // Validate request fields
      validateRequestFields({ region, VpcId, SubnetId, GatewayId, DestinationCidrBlock });
  
      // Initialize EC2 Client
      const ec2Client = initializeEC2Client(region);
  
      // Create Route Table
      const routeTableResult = await createRouteTable(ec2Client, VpcId);
  
      // Add a Route to the Route Table
      await addRouteToTable(ec2Client, routeTableResult.RouteTable.RouteTableId, GatewayId, DestinationCidrBlock);
  
      // Associate Route Table with Subnet
      await associateRouteTable(ec2Client, routeTableResult.RouteTable.RouteTableId, SubnetId);
  
      // Return success response
      return sendResponse(200, {
        success: true,
        message: "Route Table created and associated successfully",
        RouteTableId: routeTableResult.RouteTable.RouteTableId,
        details: routeTableResult.RouteTable,
      });
    } catch (error) {
      console.error("Error creating Route Table:", error.message || error);
      return sendResponse(500, {
        success: false,
        error: "Failed to create Route Table",
        details: error.message || "Internal Server Error",
      });
    }
  }
  
  /**
   * Validate required fields in the request
   */
  function validateRequestFields({ region, VpcId, SubnetId, GatewayId, DestinationCidrBlock }) {
    const missingFields = [];
    if (!region) missingFields.push("region");
    if (!VpcId) missingFields.push("VpcId");
    if (!SubnetId) missingFields.push("SubnetId");
    if (!GatewayId) missingFields.push("GatewayId");
    if (!DestinationCidrBlock) missingFields.push("DestinationCidrBlock");
  
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
   * Create a Route Table using CreateRouteTableCommand
   */
  async function createRouteTable(ec2Client, vpcId) {
    const params = {
      VpcId: vpcId,
    };
  
    console.log("Creating Route Table with params:", params);
  
    try {
      const command = new CreateRouteTableCommand(params);
      const result = await ec2Client.send(command);
  
      console.log("Route Table Created Successfully:", result.RouteTable);
      return result;
    } catch (error) {
      console.error("AWS SDK Error during Route Table creation:", error.message || error);
      throw new Error("AWS SDK failed to create Route Table");
    }
  }
  
  /**
   * Add a route to a Route Table using CreateRouteCommand
   */
  async function addRouteToTable(ec2Client, routeTableId, gatewayId, destinationCidrBlock) {
    const params = {
      RouteTableId: routeTableId,
      GatewayId: gatewayId,
      DestinationCidrBlock: destinationCidrBlock,
    };
  
    console.log("Adding Route to Route Table with params:", params);
  
    try {
      const command = new CreateRouteCommand(params);
      await ec2Client.send(command);
  
      console.log(`Route added to Route Table ${routeTableId}`);
    } catch (error) {
      console.error("AWS SDK Error during route creation:", error.message || error);
      throw new Error("AWS SDK failed to add route to Route Table");
    }
  }
  
  /**
   * Associate a Route Table with a Subnet using AssociateRouteTableCommand
   */
  async function associateRouteTable(ec2Client, routeTableId, subnetId) {
    const params = {
      RouteTableId: routeTableId,
      SubnetId: subnetId,
    };
  
    console.log("Associating Route Table with Subnet with params:", params);
  
    try {
      const command = new AssociateRouteTableCommand(params);
      await ec2Client.send(command);
  
      console.log(`Route Table ${routeTableId} associated with Subnet ${subnetId}`);
    } catch (error) {
      console.error("AWS SDK Error during Route Table association:", error.message || error);
      throw new Error("AWS SDK failed to associate Route Table with Subnet");
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
  