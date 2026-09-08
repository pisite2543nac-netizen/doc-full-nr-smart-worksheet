"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireActive = requireActive;
exports.requireAdmin = requireAdmin;
const https_1 = require("firebase-functions/v2/https");
const firebase_1 = require("./firebase");
async function requireActive(req) { if (!req.auth)
    throw new https_1.HttpsError('unauthenticated', 'กรุณาเข้าสู่ระบบ'); const snap = await firebase_1.db.doc(`users/${req.auth.uid}`).get(); if (!snap.exists)
    throw new https_1.HttpsError('permission-denied', 'ไม่พบโปรไฟล์'); const u = snap.data(); if (u.isActive !== true)
    throw new https_1.HttpsError('permission-denied', 'บัญชีถูกระงับ'); return { uid: req.auth.uid, ...u }; }
async function requireAdmin(req) { const u = await requireActive(req); if (u.role !== 'admin')
    throw new https_1.HttpsError('permission-denied', 'Admin only'); return u; }
