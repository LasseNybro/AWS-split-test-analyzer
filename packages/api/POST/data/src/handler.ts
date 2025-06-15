import type { SQSHandler, SQSRecord } from 'aws-lambda';
import { SQSEvent } from './types';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { postData } from './event-handler';
import config from './config';

export const handler: SQSHandler = async (event: SQSEvent) => {
  console.log(`Received ${event.Records.length} messages from SQS`);

  for (const record of event.Records) {
    await processMessage(record);
  }

  return;
};

const processMessage = async (record: SQSRecord): Promise<void> => {
  console.log('Processing message:', record.messageId);
  console.log('Message Body:', record.body);

  const client = new DynamoDBClient({
    region: config.awsRegion
  });

  // Example: parse JSON body if your messages are JSON
  try {
    await postData(client, record.body);
    // Do something with the data here (e.g., store in DB, call API, etc.)

  } catch (error) {
    console.error(`Error processing message ${record.messageId}:`, error);
    throw error; // Rethrow error to ensure message is not deleted from SQS
  }
};

