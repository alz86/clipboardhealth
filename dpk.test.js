const { deterministicPartitionKey, calculateDigest, serializeDataToString, getSettings } = require("./dpk");

describe("deterministicPartitionKey", () => {

  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });
  
  it("Returns the partition key value when it is minor to the maximum allowed size", () => {
    const testObject = {partitionKey: '1234'};
    const partitionKey = deterministicPartitionKey(testObject);
    expect(partitionKey).toBe("1234");
  });
  
  it("Returns the digest of the object serialized to JSON when no partition key is provided", () => {
    const testObject = { action: 'serialize', to: 'json'};
    const digestResult = calculateDigest(serializeDataToString(testObject));
    const partitionKey = deterministicPartitionKey(testObject);
    expect(partitionKey).toBe(digestResult);
  });
  
  it("Object passed as partitionKeys are serialized into string and used as keys", () => {
    const partitionKeyObj = { partition: '1', key: '2'};
    const digestResult = serializeDataToString(partitionKeyObj);
    const key = deterministicPartitionKey({ partitionKey: partitionKeyObj });
    expect(key).toBe(digestResult);
  });

  
  it("Partition keys exceeding max length are trimmed", () => {
    const key = '0'.repeat(getSettings().MAX_PARTITION_KEY_LENGTH + 1);
    const testObj = { partitionKey: key };
    const digestResult = calculateDigest(key);
    const partitionKey = deterministicPartitionKey(testObj);
    expect(partitionKey).toBe(digestResult);
  });

  it("Serialized Partition key objects exceeding max length are trimmed", () => {
    const key = '0'.repeat(getSettings().MAX_PARTITION_KEY_LENGTH + 1);
    const testObj = { field1: key, field2: key } ;
    const digestResult = calculateDigest(serializeDataToString(testObj) );
    const partitionKey = deterministicPartitionKey(testObj);
    expect(partitionKey).toBe(digestResult);
  });
});