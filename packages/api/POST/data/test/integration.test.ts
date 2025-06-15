import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { uploadData, getData } from "../src/database-handler";
import { handler } from "../src/handler";
import type { SQSEvent } from "aws-lambda";

const ddbMock = mockClient(DynamoDBClient);

describe("integration test", () => {
  it("receives an SQS event to upload data to DynamoDB", async () => {
    // Arrange
    const event: SQSEvent = {
      Records: [
        {
          body: JSON.stringify([{
            customerId: "123",
            userId: "456",
            variant: "A",
            experimentId: "789",
            value: true,
          }]),
          messageId: "abc",
          receiptHandle: "def",
          attributes: {
            ApproximateReceiveCount: "0",
            SentTimestamp: "now",
            SenderId: "id",
            ApproximateFirstReceiveTimestamp: "now"
          },
          messageAttributes: {},
          md5OfBody: "ghi",
          eventSource: "source",
          eventSourceARN: "sourceARN",
          awsRegion: "eu-north-1",
        },
      ],
    };
    ddbMock.on(GetItemCommand).resolves({});

    const mockContext = {} as any;
    const mockCallback = jest.fn();

    // Act
    await handler(event, mockContext, mockCallback);
    
    // Assert
    expect(ddbMock.calls()[0]).toBeDefined();
    expect(ddbMock.calls()[1]).toBeDefined();
  });
});