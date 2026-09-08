"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserRole = exports.createUser = void 0;
const https_1 = require("firebase-functions/v2/https");
const firebase_1 = require("../shared/firebase");
const auth_1 = require("../shared/auth");
const audit_1 = require("../shared/audit");
const region = 'asia-southeast1';
exports.createUser = (0, https_1.onCall)({ region }, async (req) => { const a = await (0, auth_1.requireAdmin)(req); const { email, password, displayName, role = 'user', studentId, classroomId } = req.data; if (!email || !password || !displayName || !['admin', 'user'].includes(role))
    throw new https_1.HttpsError('invalid-argument', 'ข้อมูลไม่ครบ'); const u = await firebase_1.adminAuth.createUser({ email, password, displayName }); await firebase_1.adminAuth.setCustomUserClaims(u.uid, { role }); await firebase_1.db.doc(`users/${u.uid}`).set({ email, displayName, role, isActive: true, studentId: studentId || null, classroomId: classroomId || null, createdAt: firebase_1.FieldValue.serverTimestamp(), updatedAt: firebase_1.FieldValue.serverTimestamp() }); await (0, audit_1.audit)(a, 'CREATE_USER', 'user', u.uid, { role }); return { uid: u.uid }; });
exports.setUserRole = (0, https_1.onCall)({ region }, async (req) => { const a = await (0, auth_1.requireAdmin)(req); const { uid, role } = req.data; if (!uid || !['admin', 'user'].includes(role))
    throw new https_1.HttpsError('invalid-argument', 'role ไม่ถูกต้อง'); await firebase_1.adminAuth.setCustomUserClaims(uid, { role }); await firebase_1.db.doc(`users/${uid}`).update({ role, updatedAt: firebase_1.FieldValue.serverTimestamp() }); await (0, audit_1.audit)(a, 'UPDATE_USER', 'user', uid, { role }); return { ok: true }; });
