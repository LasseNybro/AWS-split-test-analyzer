import type { SQSRecord } from 'aws-lambda';

export type SQSEvent = {
  Records: SQSRecord[];
};

export type DataEntry = {
  // Partition Key
  customerId: string;

  // Sort Key
  userId_ExperimentalId: string;

  // User specific
  userId: string;
  createdAt: Date;

  // Experiment specific
  variant: string;
  experimentId: string;
  
  // Event specific
  lastChanged: Date;
  value: boolean;
};

export type IncomingData = {
  customerId: string;
  userId: string;
  variant: string;
  experimentId: string;
  value: boolean;
}