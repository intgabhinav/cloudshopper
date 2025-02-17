async function orchestrateOrder(order, resourceTemplates, jobResults) {
    // Sort resources based on execution order
    const sortedResources = order.resources.sort((a, b) => a.order - b.order);
    
    // Store job results dynamically as they complete
    const completedJobs = {};

    for (const resource of sortedResources) {
        const { name, type, parent, inputs = {} } = resource;

        // Get the matching resource template
        const template = resourceTemplates.find(t => t.type === type);
        if (!template) {
            console.error(`No template found for resource type: ${type}`);
            continue;
        }

        // Resolve parent dependencies
        const resolvedInputs = resolveInputs(template.inputs, parent, completedJobs, order.inputFields);

        // Construct the final request payload
        const requestData = {
            api: template.api,
            type: template.type,
            inputs: resolvedInputs
        };

        console.log(`Creating resource: ${name} (${type}) with data:`, requestData);

        // Simulate API call to create the resource
        const jobResult = await createResource(requestData);
        
        // Store job result for future dependencies
        completedJobs[name] = jobResult;
    }
}

// Helper function to resolve inputs dynamically
function resolveInputs(templateInputs, parentNames, completedJobs, inputFields) {
    const resolvedInputs = JSON.parse(JSON.stringify(templateInputs)); // Deep copy

    // Replace placeholders with input fields
    Object.keys(resolvedInputs).forEach(key => {
        if (typeof resolvedInputs[key] === 'string') {
            resolvedInputs[key] = resolvedInputs[key].replace(/\{inputFields\.(\w+)\}/g, (_, field) => inputFields[field] || '');
        }
    });

    // Replace parent references with job results
    if (parentNames) {
        Object.keys(resolvedInputs).forEach(key => {
            if (Array.isArray(resolvedInputs[key])) {
                resolvedInputs[key] = resolvedInputs[key].map(value => 
                    replaceParentValue(value, parentNames, completedJobs)
                );
            } else {
                resolvedInputs[key] = replaceParentValue(resolvedInputs[key], parentNames, completedJobs);
            }
        });
    }

    return resolvedInputs;
}

// Helper function to replace parent values from job results
function replaceParentValue(value, parentNames, completedJobs) {
    if (typeof value === 'string') {
        return value.replace(/\{jobs\.(\w+)\.outputs\.(\w+)\}/g, (_, parentName, outputField) => {
            return completedJobs[parentName]?.outputs[outputField] || '';
        });
    }
    return value;
}

// Simulated API call
async function createResource(requestData) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                outputs: {
                    SubnetId: `subnet-${Math.floor(Math.random() * 100000)}`,
                    VpcId: `vpc-${Math.floor(Math.random() * 100000)}`
                }
            });
        }, 1000);
    });
}

// Example Usage
const order = {
    "_id": "67ada7638492c75686839cf4",
    "bundle": "magento",
    "plan": "personal",
    "region": "us-east-1",
    "resources": [
        { "name": "VPC", "type": "AWS::EC2::VPC", "order": 0 },
        { "name": "PrivateSubnetA", "type": "AWS::EC2::Subnet", "order": 1, "parent": ["VPC"], "inputs": { "CidrBlock": "10.16.1.0/25" }},
        { "name": "PrivateSubnetB", "type": "AWS::EC2::Subnet", "order": 1, "parent": ["VPC"], "inputs": { "CidrBlock": "10.16.3.0/25" }},
        { "name": "DBSubnetGroup", "type": "AWS::RDS::DBSubnetGroup", "order": 2, "parent": ["PrivateSubnetA", "PrivateSubnetB"] }
    ],
    "inputFields": {
        "region": "us-east-1",
        "sitename": "myvpc",
        "username": "admin",
        "password": "abc123"
    },
    "status": "Review"
};

const resourceTemplates = [
    {
        "_id": "template-vpc",
        "name": "VPC",
        "api": "/api/aws/ec2/create-vpc",
        "type": "AWS::EC2::VPC",
        "command": "CreateVpcCommand",
        "inputs": { "CidrBlock": "10.16.0.0/22", "name": "{inputFields.sitename}" }
    },
    {
        "_id": "template-subnet",
        "name": "Subnet",
        "api": "/api/aws/ec2/create-subnet",
        "type": "AWS::EC2::Subnet",
        "command": "CreateSubnetCommand",
        "parent": { "vpc": "VPC" },
        "inputs": { "VpcId": "{jobs.VPC.outputs.VpcId}", "CidrBlock": "{inputs.CidrBlock}", "Name": "{inputFields.sitename}-subnet" }
    },
    {
        "_id": "template-dbsubnetgroup",
        "name": "DBSubnetGroup",
        "api": "/api/aws/rds/create-db-subnet-group",
        "type": "AWS::RDS::DBSubnetGroup",
        "command": "CreateDBSubnetGroupCommand",
        "parent": { "subnets": ["PrivateSubnetA", "PrivateSubnetB"] },
        "inputs": {
            "DBSubnetGroupName": "{inputFields.sitename}-dbsubnetgroup",
            "DBSubnetGroupDescription": "Subnet group for {inputFields.sitename}",
            "SubnetIds": [
                "{jobs.PrivateSubnetA.outputs.SubnetId}",
                "{jobs.PrivateSubnetB.outputs.SubnetId}"
            ],
            "Tags": [
                { "Key": "Name", "Value": "{inputFields.sitename}-dbsubnetgroup" }
            ]
        }
    }
];

// Run the orchestrator
orchestrateOrder(order, resourceTemplates, {});
