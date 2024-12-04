import { EC2Client, CreateVpcCommand } from "@aws-sdk/client-ec2";

export const runtime = "nodejs";

export async function POST(req) {
  const { cidrBlock } = await req.json();

  const ec2Client = new EC2Client({ region: process.env.AWS_REGION });

  try {
    const command = new CreateVpcCommand({
      CidrBlock: cidrBlock,
      TagSpecifications: [{ ResourceType: "vpc", Tags: [{ Key: "Name", Value: "MyVPC" }] }],
    });
    const response = await ec2Client.send(command);
    return new Response(JSON.stringify({ vpcId: response.Vpc.VpcId }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
