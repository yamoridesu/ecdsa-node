import { useState } from 'react';
import server from './server';
import * as secp from 'ethereum-cryptography/secp256k1';
import * as keccak from 'ethereum-cryptography/keccak';
import * as utils from 'ethereum-cryptography/utils';

function Transfer({ address, setBalance, privateKey }) {
  const { utf8ToBytes, toHex } = utils;
  const { signSync, sign } = secp;
  const [sendAmount, setSendAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    let transaction = {
      amount: parseInt(sendAmount),
      recipient,
    };
    let hash = toHex(keccak.keccak256(utf8ToBytes(JSON.stringify(transaction))));
    console.log(`Hash: ${hash}`);
    // const signature = signSync(hash, privateKey);
    const signature = await sign(hash, privateKey);
    const data = {
      transaction,
      signature: toHex(signature)
    }
    try {
      const {
        data: { balance },
      } = await server.post(`send`, data);
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
