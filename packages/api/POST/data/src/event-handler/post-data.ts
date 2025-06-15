import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { getData, uploadData } from "../database-handler";
import config from "../config";
import type { DataEntry, IncomingData } from "../types";

export const postData = async (client: DynamoDBClient, body: string) => {
  const incomingData = JSON.parse(body) as IncomingData[];

  if(incomingData.length > config.upperLimitOnEvents) {
    throw new Error(`Too many events received: ${incomingData.length}. Maximum allowed is ${config.upperLimitOnEvents}.`);
  };

  const dataEntries = await Promise.all(incomingData.map(async (data: IncomingData) => {
    const dataEntry = await createDataEntry(client, data);
      
    await uploadData(client, dataEntry);
  }));
}

const createDataEntry = async (client: DynamoDBClient, data: IncomingData): Promise<DataEntry> => {
  // Implement your logic to create a data entry
  // This is a placeholder function; replace with actual implementation
  const userId_ExperimentalId = `${data.userId}_${data.experimentId}`;
  const customerId = data.customerId;

  const existingDataEntry: DataEntry | undefined = await getData(client, customerId, userId_ExperimentalId);

  const createdAt: Date = existingDataEntry ? new Date(existingDataEntry.createdAt) : new Date();

  console.log('Parsed message body:', data);

  console.log('Creating data entry with data:', data);
  return {
    customerId, 
    userId_ExperimentalId,
    createdAt,
    userId: data.userId,
    experimentId: data.experimentId,
    variant: data.variant,
    value: data.value,
    lastChanged: new Date(),
  };
};
