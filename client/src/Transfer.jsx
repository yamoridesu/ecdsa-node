import * as secp from 'ethereum-cryptography/secp256k1';
import * as keccak from 'ethereum-cryptography/keccak';
import * as utils from 'ethereum-cryptography/utils';
import { useState } from 'react';
import server from './server';

function Transfer({ address, setBalance, privateKey }) {
  const { keccak256 } = keccak;
  const { utf8ToBytes, toHex } = utils;
  const [sendAmount, setSendAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const setValue = (setter) => (evt) => setter(evt.target.value);

  function hashMessage(msg) {
    const bytes = utf8ToBytes(msg);
    const hash = keccak256(bytes);
    return hash;
  }

  async function signMessage(msg, key) {
    const hash = hashMessage(msg);
    const signed = secp.sign(hash, key, { recovered: true });
    return signed;
  }

  async function transfer(evt) {
    evt.preventDefault();
    let transaction = {
      amount: parseInt(sendAmount),
      recipient,
    };
    const message = JSON.stringify(transaction);
    const [signature, recoveryBit] = await signMessage(message, privateKey);

    const body = {
      transaction,
      signature: toHex(signature),
      recoveryBit,
    };
    try {
      const {
        data: { balance },
      } = await server.post(`send`, body);
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
