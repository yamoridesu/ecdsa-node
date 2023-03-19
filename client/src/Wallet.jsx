import server from './server';
import * as secp from 'ethereum-cryptography/secp256k1';
import * as keccak from 'ethereum-cryptography/keccak';
import * as utils from 'ethereum-cryptography/utils';

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  async function onChange(evt) {
    const _privateKey = evt.target.value;
    const publicKey = secp.getPublicKey(_privateKey);
    console.log(`Public key: ${publicKey}`)
    const address = `0x${getAddress(publicKey)}`;
    setAddress(address);
    setPrivateKey(_privateKey);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  function getAddress(publicKey) {
    return utils.toHex(keccak.keccak256(publicKey.slice(1)).slice(-20));
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Enter your private key here."
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>
      
      <label>Address: {address}</label>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
