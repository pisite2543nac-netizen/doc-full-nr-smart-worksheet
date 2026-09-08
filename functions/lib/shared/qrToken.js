"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.qrTokenSecret = void 0;
exports.signPaperToken = signPaperToken;
exports.verifyPaperToken = verifyPaperToken;
const node_crypto_1 = __importDefault(require("node:crypto"));
const params_1 = require("firebase-functions/params");
exports.qrTokenSecret = (0, params_1.defineSecret)('QR_TOKEN_SECRET');
function b64url(input) { return Buffer.from(input).toString('base64url'); }
function signPaperToken(payload) { const body = b64url(JSON.stringify(payload)); const sig = node_crypto_1.default.createHmac('sha256', exports.qrTokenSecret.value()).update(body).digest('base64url'); return `${body}.${sig}`; }
function verifyPaperToken(token) { const [body, sig] = token.split('.'); if (!body || !sig)
    throw new Error('invalid token'); const expected = node_crypto_1.default.createHmac('sha256', exports.qrTokenSecret.value()).update(body).digest('base64url'); const a = Buffer.from(sig), b = Buffer.from(expected); if (a.length !== b.length || !node_crypto_1.default.timingSafeEqual(a, b))
    throw new Error('invalid signature'); const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')); if (!parsed.worksheetId || !parsed.issuedAt || !parsed.nonce)
    throw new Error('invalid payload'); return parsed; }
