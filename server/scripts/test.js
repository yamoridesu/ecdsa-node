const secp = require('ethereum-cryptography/secp256k1');
const { keccak256 } = require('ethereum-cryptography/keccak');
const { toHex, utf8ToBytes } = require('ethereum-cryptography/utils');
const { signSync, recoverPublicKey } = secp;

// generate a private key
const privateKey = toHex(secp.utils.randomPrivateKey()); 
console.log(`Private Key ${privateKey}`);// byte array
const myKey =
  '9856b553402369669a89d3c0668f79c6a9919e461baca9726ec9ff6b9304589b';

const publicKey = secp.getPublicKey(myKey);
console.log(`Public key: ${publicKey}`)
const address = toHex(getAddress(publicKey));
console.log(`address: ${address}`);

function getAddress(publicKey) {
  return keccak256(publicKey.slice(1)).slice(-20);
}

function hashMessage(message) {
  const bytes = utf8ToBytes(message);
  const hash = keccak256(bytes);
  return hash;
}

async function signMessage(msg, key) {
  const hash = hashMessage(msg);
  const signed = secp.sign(hash, key, { recovered: true });
  return signed;
}

async function recoverKey(message, signature, recoveryBit) {
  let hash = hashMessage(message);
  let publicKey = secp.recoverPublicKey(hash, signature, recoveryBit);
  return publicKey;
}

const transaction = {
  amount: 1
}

let message = JSON.stringify(transaction);

async function run() {
  let hash = hashMessage(message);
  console.log(`\nHash: ${hash}`);

  const [signature, recoveryBit] = await signMessage(message, myKey);
  console.log(`\nSignature: ${signature}`);
  console.log(`\nRecovery Bit ${recoveryBit}`)
  const recoveredPublicKey = await recoverKey(message, signature, recoveryBit)
  console.log(`Recovered Public key ${recoveredPublicKey}`);
}

run();
// const recoveredPublicKey = recoverPublicKey(hash, signature, 1);
// console.log(`Recovered Public key ${recoveredPublicKey}`)