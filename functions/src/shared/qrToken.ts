import crypto from 'node:crypto';
import { defineSecret } from 'firebase-functions/params';
export const qrTokenSecret=defineSecret('QR_TOKEN_SECRET');
type Payload={worksheetId:string;userId?:string;issuedAt:number;nonce:string};
function b64url(input:string|Buffer){return Buffer.from(input).toString('base64url')}
export function signPaperToken(payload:Payload){const body=b64url(JSON.stringify(payload));const sig=crypto.createHmac('sha256',qrTokenSecret.value()).update(body).digest('base64url');return `${body}.${sig}`}
export function verifyPaperToken(token:string):Payload{const [body,sig]=token.split('.');if(!body||!sig)throw new Error('invalid token');const expected=crypto.createHmac('sha256',qrTokenSecret.value()).update(body).digest('base64url');const a=Buffer.from(sig),b=Buffer.from(expected);if(a.length!==b.length||!crypto.timingSafeEqual(a,b))throw new Error('invalid signature');const parsed=JSON.parse(Buffer.from(body,'base64url').toString('utf8')) as Payload;if(!parsed.worksheetId||!parsed.issuedAt||!parsed.nonce)throw new Error('invalid payload');return parsed}
