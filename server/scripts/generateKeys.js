const secp = require('ethereum-cryptography/secp256k1');
const { keccak256 } = require('ethereum-cryptography/keccak');
const { toHex } = require('ethereum-cryptography/utils');

const privateKey = secp.utils.randomPrivateKey();
console.log(`private key: ${toHex(privateKey)}`);

const publicKey = secp.getPublicKey(privateKey);
const address = getAddress(publicKey)
console.log(`address: ${address}`);

function getAddress(publicKey) {
  return keccak256(publicKey.slice(1)).slice(-20);
}