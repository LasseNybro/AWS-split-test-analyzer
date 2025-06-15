import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { uploadData, getData } from "../src/database-handler";
import type { DataEntry } from "../src/types";

const ddbMock = mockClient(DynamoDBClient);

const client = new DynamoDBClient({ region: "eu-north-1" });

describe("get-data function", () => {
  beforeEach(() => ddbMock.reset());

  it("returns a user when found", async () => {
    // Arrange
    const customerId = "123";
    const userId = "456";
    const experimentId = "789";
    ddbMock.on(GetItemCommand).resolves({
      Item: {
        customerId: { S: customerId },
        userId: { S: userId },
        experimentId: { S: experimentId },
        userId_experimentId: { S: `${userId}_${experimentId}` },
        createdAt: { S: new Date().toISOString() },
        variant: { S: "A" },
        value: { BOOL: true },
        lastChanged: { S: new Date().toISOString() },
      },
    });

    // Act
    const result = await getData(client, "123", "456_789");

    // Assert
    expect(result).toEqual({ customerId, userId, experimentId, userId_experimentId: `${userId}_${experimentId}`, variant: "A", value: true, createdAt: expect.any(String), lastChanged: expect.any(String) });
  });

  it("returns undefined if user not found", async () => {
    // Arrange
    ddbMock.on(GetItemCommand).resolves({});

    // Act
    const result = await getData(client, "123", "456_789");
    
    // Assert
    expect(result).toBeUndefined();
  });
});


describe("upload-data function", () => {
  beforeEach(() => ddbMock.reset());

  it("uploads data to dynamodb when function is called", async () => {
    // Arrange
    const date = new Date();
    const customerId = "123";
    const userId = "456";
    const experimentId = "789";
    const dataEntry: DataEntry = {
      customerId,
      userId_ExperimentalId: `${userId}_${experimentId}`,
      userId,
      createdAt: date,
      variant: "A",
      experimentId,
      lastChanged: date,
      value: true,
    }
    ddbMock.on(PutItemCommand).resolves({});

    // Act
    await uploadData(client, dataEntry);
    
    // Assert
    expect(ddbMock.calls()[0].args[0].input).toEqual(
      { Item: {
        customerId: {
          S: customerId
        },
        userId_ExperimentalId: {
          S: `${userId}_${experimentId}`
        },
        userId: { S: userId },
        experimentId: { S: experimentId },
        createdAt: { S: date.toISOString() },
        variant: { S: "A" },
        value: { BOOL: true },
        lastChanged: { S: date.toISOString() },
       },
       TableName: "your-default-table-name"
      });
  });
});
