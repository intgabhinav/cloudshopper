import { EC2Client, CreateVpcCommand, CreateSecurityGroupCommand, RunInstancesCommand } from "@aws-sdk/client-ec2";
// import { RDSClient, CreateDBInstanceCommand } from "@aws-sdk/client-rds";
import { S3Client, CreateBucketCommand, DeleteBucketCommand } from "@aws-sdk/client-s3";

export const runtime = "nodejs"; // Ensure server-side runtime

// POST /api/aws/create-resources
export async function POST(req) {
  const body = await req.json();
  console.log("Received data:", body);

  const { selectedFirstOption, selectedSecondSetOption, inputFields } = body;

  if (!selectedFirstOption || !selectedSecondSetOption || !inputFields) {
    return new Response(
      JSON.stringify({ error: "Invalid request payload" }),
      { status: 400 }
    );
  }
  console.log(inputFields.sitename);
  // AWS Configuration
  const region = process.env.AWS_REGION || "us-east-1";
  const ec2Client = new EC2Client({ region });
  // const rdsClient = new RDSClient({ region });
  const s3Client = new S3Client({ region });

  let resources = {}; // Track created resources for potential cleanup

  try {
    // // Step 1: Create VPC
    // const vpcCommand = new CreateVpcCommand({
    //   CidrBlock: "10.0.0.0/22",
    //   TagSpecifications: [
    //     {
    //       ResourceType: "vpc",
    //       Tags: [{ Key: "Name", Value: "MyVPC" }],
    //     },
    //   ],
    // });
    // const vpcResponse = await ec2Client.send(vpcCommand);
    // resources.vpcId = vpcResponse.Vpc.VpcId;

    // Step 2: Create Security Group
    // const securityGroupCommand = new CreateSecurityGroupCommand({
    //   GroupName: "MySecurityGroup",
    //   Description: "Allow SSH and HTTP",
    //   VpcId: resources.vpcId,
    // });
    // const sgResponse = await ec2Client.send(securityGroupCommand);
    // resources.securityGroupId = sgResponse.GroupId;

    // // Step 3: Launch EC2 Instance
    // const instanceCommand = new RunInstancesCommand({
    //   ImageId: "ami-0c02fb55956c7d316", // Amazon Linux 2 AMI
    //   InstanceType: "t2.micro",
    //   MinCount: 1,
    //   MaxCount: 1,
    //   SecurityGroupIds: [resources.securityGroupId],
    //   SubnetId: resources.vpcId, // Replace with actual subnet ID in the VPC
    //   TagSpecifications: [
    //     {
    //       ResourceType: "instance",
    //       Tags: [{ Key: "Name", Value: "MyEC2Instance" }],
    //     },
    //   ],
    // });
    // const instanceResponse = await ec2Client.send(instanceCommand);
    // resources.instanceId = instanceResponse.Instances[0].InstanceId;

    // // Step 4: Create RDS Database
    // const dbCommand = new CreateDBInstanceCommand({
    //   DBInstanceIdentifier: "mydbinstance",
    //   DBInstanceClass: "db.t2.micro",
    //   Engine: "mysql",
    //   MasterUsername: "admin",
    //   MasterUserPassword: "password",
    //   AllocatedStorage: 20,
    //   VpcSecurityGroupIds: [resources.securityGroupId],
    // });
    // const dbResponse = await rdsClient.send(dbCommand);
    // resources.dbInstanceId = dbResponse.DBInstance.DBInstanceIdentifier;

    // Step 5: Create S3 Bucket
    const bucketName = inputFields.sitename; // Generate a unique bucket name
    const bucketCommand = new CreateBucketCommand({
      Bucket: bucketName,
      CreateBucketConfiguration: {
        //LocationConstraint: region,
      },
    });
    const bucketResponse = await s3Client.send(bucketCommand);
    resources.bucketName = bucketName;

    // Return success response
    return new Response(
      JSON.stringify({
        message: "All resources created successfully",
        resources,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during resource creation:", error);

    // Cleanup resources if an error occurs
    await cleanupResources(resources, ec2Client, s3Client);
    return new Response(
      JSON.stringify({ error: "Failed to create resources", details: error.message }),
      { status: 500 }
    );
  }
}

// Cleanup function to delete partially created resources
async function cleanupResources(resources, ec2Client, s3Client) {
  try {
    if (resources.bucketName) {
      await s3Client.send(
        new DeleteBucketCommand({
          Bucket: resources.bucketName,
        })
      );
    }
    // if (resources.dbInstanceId) {
    //   await rdsClient.send(
    //     new DeleteDBInstanceCommand({
    //       DBInstanceIdentifier: resources.dbInstanceId,
    //       SkipFinalSnapshot: true,
    //     })
    //   );
    // }
    if (resources.instanceId) {
      await ec2Client.send(
        new TerminateInstancesCommand({
          InstanceIds: [resources.instanceId],
        })
      );
    }
    if (resources.securityGroupId) {
      await ec2Client.send(
        new DeleteSecurityGroupCommand({
          GroupId: resources.securityGroupId,
        })
      );
    }
    if (resources.vpcId) {
      await ec2Client.send(
        new DeleteVpcCommand({
          VpcId: resources.vpcId,
        })
      );
    }
  } catch (cleanupError) {
    console.error("Error during cleanup:", cleanupError);
  }
}
