// midtrans-client does not ship TypeScript types; use require with a ts-ignore
// @ts-ignore
const midtransClient = require('midtrans-client');
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

const snap = new midtransClient.Snap({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
});

export default snap;

