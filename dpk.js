const crypto = require("crypto");

/** Gets the constant values used as settings for this module to work */
const getSettings = () => ({
  TRIVIAL_PARTITION_KEY :"0",
  MAX_PARTITION_KEY_LENGTH : 256,
  HASHING_ALGORITHM : "sha3-512"
 });

const SETTINGS = getSettings();

/** Calculates a digest value of the supplied data */
const calculateDigest = (data) => {
  if(typeof data !== 'string') throw Error('Only string objects are allowed');
  return crypto.createHash(SETTINGS.HASHING_ALGORITHM).update(data).digest("hex");
}
/** Converts a generic set of information into a string  */
const serializeDataToString  = JSON.stringify;

/** Process an event object returning a string that is a candidate to be a partition key  */
const getCandidateKeyFromEvent = (event) => {
  if(event.partitionKey) {
    const isPartitionKeyString = typeof event.partitionKey === 'string';
    return (isPartitionKeyString ? event.partitionKey : serializeDataToString(event.partitionKey)); 
  }
  else {
    //NOTE: arguable, we could avoid calling 'calculateDigest' here, return a plain string
    //and the caller will use that string a key (except finding it larger than allowed, in
    //which case would digest it) but it would change the return value of this method in regards to
    //the original version, breaking backward compatibility. Thus, I choose to leave this version, despite
    //in some cases might be digest twice.
    return calculateDigest(serializeDataToString(event));
  }
}

/** Gets a valid value to be used as partition Key */
const deterministicPartitionKey = (event) => {

  if(!event) return SETTINGS.TRIVIAL_PARTITION_KEY;

  const candidateKey = getCandidateKeyFromEvent(event);
  const exceedsMaxLength = candidateKey.length > SETTINGS.MAX_PARTITION_KEY_LENGTH; 
  return (exceedsMaxLength 
          ? calculateDigest(candidateKey)
          : candidateKey);
};

module.exports = { 
  deterministicPartitionKey, 
  calculateDigest, 
  serializeDataToString, 
  getSettings
};