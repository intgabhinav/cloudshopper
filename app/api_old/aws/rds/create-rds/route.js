import {
    EC2Client,
    CreateSecurityGroupCommand,
    AuthorizeSecurityGroupIngressCommand,
  } from "@aws-sdk/client-ec2";
  import {
    RDSClient,
    CreateDBSubnetGroupCommand,
    CreateDBInstanceCommand,
  } from "@aws-sdk/client-rds";
  
  /**
   * Main function to handle POST requests
   */
  export async function POST(req) {
    try {
      const body = await req.json();
      console.log("Received POST request to create MariaDB RDS and related resources:", body);
  
      const { region, inputs } = body;
      const {
        VpcId,
        subnetIds,
        securityGroupName,
        securityGroupDesc,
        dbSubnetGroupName,
        credentials,
        dbInstanceIdentifier,
        dbInstanceClass,
        allocatedStorage,
        dbName,
      } = inputs || {};
  
      // Validate required fields
      validateRequestFields({
        region,
        subnetIds,
        securityGroupName,
        securityGroupDesc,
        dbSubnetGroupName,
        credentials,
        dbInstanceIdentifier,
        dbInstanceClass,
        allocatedStorage,
        dbName,
      });
  
      // Initialize EC2 and RDS clients
      const ec2Client = initializeEC2Client(region);
      const rdsClient = initializeRDSClient(region);
  
      // Create Security Group
      const securityGroupId = await createSecurityGroup(ec2Client, VpcId, securityGroupName, securityGroupDesc);
      console.log("Created Security Group:", securityGroupId);
  
      // Add ingress rules to the Security Group
      await addSecurityGroupIngress(ec2Client, securityGroupId);
      console.log("Configured Security Group ingress rules.");
  
      // Create Subnet Group
      const subnetGroupArn = await createDBSubnetGroup(rdsClient, dbSubnetGroupName, subnetIds);
      console.log("Created DB Subnet Group:", subnetGroupArn);
  
      // Create MariaDB Instance
      const dbInstanceArn = await createMariaDBInstance(rdsClient, {
        dbInstanceIdentifier,
        dbInstanceClass,
        allocatedStorage,
        dbName,
        securityGroupId,
        dbSubnetGroupName,
        credentials,
      });
  
      console.log("Created MariaDB Instance:", dbInstanceArn);
  
      // Return success response
      return sendResponse(200, {
        success: true,
        message: "MariaDB RDS and resources created successfully",
        securityGroupId,
        subnetGroupArn,
        dbInstanceArn,
      });
    } catch (error) {
      console.error("Error creating MariaDB RDS resources:", error.message || error);
      return sendResponse(500, {
        success: false,
        error: "Failed to create MariaDB RDS resources",
        details: error.message || "Internal Server Error",
      });
    }
  }
  
  /**
   * Validate required fields in the request
   */
  function validateRequestFields({
    region,
    subnetIds,
    securityGroupName,
    securityGroupDesc,
    dbSubnetGroupName,
    credentials,
    dbInstanceIdentifier,
    dbInstanceClass,
    allocatedStorage,
    dbName,
  }) {
    const missingFields = [];
    if (!region) missingFields.push("region");
    if (!subnetIds || subnetIds.length === 0) missingFields.push("subnetIds");
    if (!securityGroupName) missingFields.push("securityGroupName");
    if (!securityGroupDesc) missingFields.push("securityGroupDesc");
    if (!dbSubnetGroupName) missingFields.push("dbSubnetGroupName");
    if (!credentials || !credentials.username || !credentials.password)
      missingFields.push("credentials (username and password)");
    if (!dbInstanceIdentifier) missingFields.push("dbInstanceIdentifier");
    if (!dbInstanceClass) missingFields.push("dbInstanceClass");
    if (!allocatedStorage) missingFields.push("allocatedStorage");
    if (!dbName) missingFields.push("dbName");
  
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }
  }
  
  /**
   * Initialize EC2 Client
   */
  function initializeEC2Client(region) {
    return new EC2Client({ region });
  }
  
  /**
   * Initialize RDS Client
   */
  function initializeRDSClient(region) {
    return new RDSClient({ region });
  }
  
  /**
   * Create Security Group
   */
  async function createSecurityGroup(ec2Client, VpcId, groupName, description) {
    console.log("Creating Security Group with name:", groupName);
  
    const command = new CreateSecurityGroupCommand({
      GroupName: groupName,
      Description: description,
      VpcId: VpcId,
    });
  
    const result = await ec2Client.send(command);
    return result.GroupId;
  }
  
  /**
   * Add Security Group Ingress Rules
   */
  async function addSecurityGroupIngress(ec2Client, securityGroupId) {
    console.log("Adding ingress rules to Security Group:", securityGroupId);
  
    const command = new AuthorizeSecurityGroupIngressCommand({
      GroupId: securityGroupId,
      IpPermissions: [
        {
          IpProtocol: "tcp",
          FromPort: 3306,
          ToPort: 3306,
          IpRanges: [{ CidrIp: "0.0.0.0/0", Description: "Allow MariaDB access" }],
        },
      ],
    });
  
    await ec2Client.send(command);
  }
  
  /**
   * Create DB Subnet Group
   */
  async function createDBSubnetGroup(rdsClient, subnetGroupName, subnetIds) {
    console.log("Creating DB Subnet Group with name:", subnetGroupName);
  
    const command = new CreateDBSubnetGroupCommand({
      DBSubnetGroupName: subnetGroupName,
      SubnetIds: subnetIds,
      DBSubnetGroupDescription: `Subnet group for ${subnetGroupName}`,
    });
  
    const result = await rdsClient.send(command);
    return result.DBSubnetGroup.DBSubnetGroupArn;
  }
  
  /**
   * Create MariaDB Instance
   */
  async function createMariaDBInstance(rdsClient, params) {
    console.log("Creating MariaDB Instance with parameters:", params);
  
    const command = new CreateDBInstanceCommand({
      DBInstanceIdentifier: params.dbInstanceIdentifier,
      DBInstanceClass: params.dbInstanceClass,
      Engine: "mariadb",
      MasterUsername: params.credentials.username,
      MasterUserPassword: params.credentials.password,
      AllocatedStorage: params.allocatedStorage,
      DBSubnetGroupName: params.dbSubnetGroupName,
      VpcSecurityGroupIds: [params.securityGroupId],
      DBName: params.dbName,
    });
  
    const result = await rdsClient.send(command);
    return result.DBInstance.DBInstanceArn;
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