"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerTime = void 0;
const https_1 = require("firebase-functions/v2/https");
const auth_1 = require("./auth");
exports.getServerTime = (0, https_1.onCall)({ region: 'asia-southeast1' }, async (req) => { await (0, auth_1.requireActive)(req); return { serverTime: Date.now() }; });
