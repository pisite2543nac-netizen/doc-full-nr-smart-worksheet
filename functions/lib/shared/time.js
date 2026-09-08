"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nowMs = nowMs;
exports.toMs = toMs;
const firebase_1 = require("./firebase");
function nowMs() { return Date.now(); }
function toMs(v) { if (!v)
    return undefined; if (v instanceof firebase_1.Timestamp)
    return v.toMillis(); if (typeof v.toMillis === 'function')
    return v.toMillis(); if (typeof v === 'string')
    return new Date(v).getTime(); if (v instanceof Date)
    return v.getTime(); return undefined; }
