import { DynamoDBClient, GetItemCommand, GetItemCommandInput, GetItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import config from "../config";
import type { DataEntry } from "../types";

export const getData = async (client: DynamoDBClient, customerId: string, userId_ExperimentalId: string): Promise<DataEntry | undefined> => {
  console.log("Fetching data entry from DynamoDB:", customerId, userId_ExperimentalId);

  const params: GetItemCommandInput = {
    TableName: config.dynamoDbTableName,
    Key: {
      customerId: { S: customerId },
      userId_ExperimentalId: { S: userId_ExperimentalId },
    },
  };

  try {
    const command = new GetItemCommand(params);
    const existingDataEntry = await client.send(command);

    console.log("Data entry fetched successfully");

    return existingDataEntry.Item ? unmarshall(existingDataEntry.Item) as DataEntry : undefined;
  } catch (error) {
    console.error("Error uploading data entry:", error);
    throw error; // Rethrow error to handle it in the calling function
  }
};