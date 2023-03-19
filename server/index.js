const {
  toHex,
  utf8ToBytes,
  hexToBytes,
} = require('ethereum-cryptography/utils');
const { verify, recoverPublicKey } = require('ethereum-cryptography/secp256k1');
const { keccak256 } = require('ethereum-cryptography/keccak');
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  '0x857a4f15593a01ada7027e8cff66073c1b64ba19': 100,
  '0x24ec2e794b334fda7d459e44184969d51be34a5f': 50,
  '0xe73a059356f0e7ef0c4b68fafdeb54f351a0d434': 75,
};

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const { signature, transaction, recoveryBit } = req.body;
  const { recipient, amount } = transaction;

  const hash = toHex(keccak256(utf8ToBytes(JSON.stringify(transaction))));
  const publicKey = recoverPublicKey(hash, signature, recoveryBit);
  if (verify(signature, hash, publicKey) === false) {
    return res.status(403).send({ message: 'Request is not valid.' });
  }

  const sender = '0x' + getAddress(publicKey);
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: 'Not enough funds!' });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function getAddress(publicKey) {
  return toHex(keccak256(publicKey.slice(1)).slice(-20));
}

module.exports = app;
