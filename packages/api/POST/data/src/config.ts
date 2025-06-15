export default {
  awsRegion: "eu-north-1", // Specify the AWS region for your DynamoDB table
  dynamoDbTableName: process.env.DYNAMODB_TABLE_NAME || "your-default-table-name", // Default table name if not set
  upperLimitOnEvents: 1000,
};
