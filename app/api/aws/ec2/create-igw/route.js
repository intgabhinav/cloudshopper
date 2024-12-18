import AWS from "aws-sdk";

export async function POST(req) {
  const body = await req.json();
  const { region } = body;

  // Validate request data
  if (!region) {
    return new Response(
      JSON.stringify({ error: "Missing required fields: region, CidrBlock, name" }),
      { status: 400 }
    );
  }

  const ec2 = new AWS.EC2({ region });

  try {
    const params = {
      TagSpecifications: [
        {
          ResourceType: "igw",
          Tags: [{ Key: "Name", Value: name }],
        },
      ],
    };

    const result = await ec2.createVpc(params).promise();
    console.log("VPC Created:", result);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error creating VPC:", error.message);

    return new Response(
      JSON.stringify({ error: "Failed to create VPC", details: error.message }),
      { status: 500 }
    );
  }
}
