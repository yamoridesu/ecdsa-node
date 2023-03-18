import axios from 'axios';

const server = axios.create({
  baseURL: 'https://ecdsa-node-roan.vercel.app',
});

export default server;
