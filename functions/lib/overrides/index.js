"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeSubmissionOverride = exports.createSubmissionOverride = void 0;
const https_1 = require("firebase-functions/v2/https");
const firebase_1 = require("../shared/firebase");
const auth_1 = require("../shared/auth");
const audit_1 = require("../shared/audit");
const region = 'asia-southeast1';
exports.createSubmissionOverride = (0, https_1.onCall)({ region }, async (req) => { const a = await (0, auth_1.requireAdmin)(req); const { worksheetId, userId, reason, validUntil } = req.data; if (!worksheetId || !userId || !reason || !validUntil)
    throw new https_1.HttpsError('invalid-argument', 'ข้อมูลไม่ครบ'); const ref = firebase_1.db.collection('submissionOverrides').doc(); await ref.set({ worksheetId, userId, reason, validUntil: firebase_1.Timestamp.fromDate(new Date(validUntil)), active: true, allowedBy: a.uid, allowedAt: firebase_1.FieldValue.serverTimestamp() }); await (0, audit_1.audit)(a, 'CREATE_OVERRIDE', 'submissionOverride', ref.id, { worksheetId, userId }); return { id: ref.id }; });
exports.revokeSubmissionOverride = (0, https_1.onCall)({ region }, async (req) => { const a = await (0, auth_1.requireAdmin)(req); const { id } = req.data; await firebase_1.db.doc(`submissionOverrides/${id}`).update({ active: false, revokedBy: a.uid, revokedAt: firebase_1.FieldValue.serverTimestamp() }); await (0, audit_1.audit)(a, 'REVOKE_OVERRIDE', 'submissionOverride', id); return { ok: true }; });
