import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import config from "../config";
import type { DataEntry } from "../types";

export const uploadData = async (client: DynamoDBClient, dataEntry: DataEntry): Promise<void> => {
  console.log("Uploading data entry to DynamoDB:", dataEntry);

  const params: PutItemCommandInput = {
    TableName: config.dynamoDbTableName,
    Item: {
      customerId: { S: dataEntry.customerId },
      userId_ExperimentalId: { S: dataEntry.userId_ExperimentalId },
      userId: { S: dataEntry.userId },
      experimentId: { S: dataEntry.experimentId },
      variant: { S: dataEntry.variant },
      lastChanged: { S: dataEntry.lastChanged.toISOString() },
      createdAt: { S: dataEntry.createdAt.toISOString() },
      value: { BOOL: dataEntry.value },
    },
  };

  try {
    const command = new PutItemCommand(params);
    await client.send(command);
    console.log("Data entry uploaded successfully");
  } catch (error) {
    console.error("Error uploading data entry:", error);
    throw error; // Rethrow error to handle it in the calling function
  }
};