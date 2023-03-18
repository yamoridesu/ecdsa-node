import server from './server';
import * as secp from 'ethereum-cryptography/secp256k1';
import * as keccak from 'ethereum-cryptography/keccak';

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  function getAddress(publicKey) {
    return secp.utils.bytesToHex(keccak.keccak256(publicKey.slice(1)).slice(-20));
  }

  async function onChange(evt) {
    const _privateKey = evt.target.value;
    console.log(`Private key`, _privateKey);
    const publicKey = secp.getPublicKey(_privateKey);
    const address = `0x${getAddress(publicKey)}`;
    console.log(`Got address: ${address}`);
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
