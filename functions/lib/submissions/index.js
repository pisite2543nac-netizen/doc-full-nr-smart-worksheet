"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmPaperSubmission = exports.submitDigitalWorksheet = exports.saveWorksheetDraft = void 0;
const https_1 = require("firebase-functions/v2/https");
const firebase_1 = require("../shared/firebase");
const auth_1 = require("../shared/auth");
const time_1 = require("../shared/time");
const audit_1 = require("../shared/audit");
const qrToken_1 = require("../shared/qrToken");
const region = 'asia-southeast1';
async function access(uid, classroomId, wid) { const s = await firebase_1.db.doc(`worksheets/${wid}`).get(); if (!s.exists)
    throw new https_1.HttpsError('not-found', 'ไม่พบใบงาน'); const w = s.data(); if (w.status !== 'published')
    throw new https_1.HttpsError('permission-denied', 'ใบงานยังไม่เผยแพร่'); if (!(w.targetUserIds || []).includes(uid) && !(w.targetClassroomIds || []).includes(classroomId))
    throw new https_1.HttpsError('permission-denied', 'ไม่มีสิทธิ์ทำใบงานนี้'); return w; }
async function validOverride(uid, wid) { const q = await firebase_1.db.collection('submissionOverrides').where('userId', '==', uid).where('worksheetId', '==', wid).where('active', '==', true).limit(10).get(); const now = Date.now(); return q.docs.some(d => { const v = d.data(); const until = (0, time_1.toMs)(v.validUntil); return !until || until > now; }); }
function enforceWindow(w, override) { const now = Date.now(), open = (0, time_1.toMs)(w.opensAt), due = (0, time_1.toMs)(w.dueAt); if (open && now < open)
    throw new https_1.HttpsError('failed-precondition', 'ยังไม่ถึงเวลาเปิด'); if (due && now > due && !w.allowLate && !override)
    throw new https_1.HttpsError('deadline-exceeded', 'หมดเวลาส่ง'); return { now, due, status: due && now > due ? 'late' : 'submitted' }; }
exports.saveWorksheetDraft = (0, https_1.onCall)({ region }, async (req) => { const u = await (0, auth_1.requireActive)(req); if (u.role !== 'user')
    throw new https_1.HttpsError('permission-denied', 'User only'); const { worksheetId, answers = {} } = req.data; const w = await access(u.uid, u.classroomId, worksheetId); if (w.saveDraftEnabled !== true)
    throw new https_1.HttpsError('failed-precondition', 'ไม่เปิดบันทึกร่าง'); const id = `${worksheetId}_${u.uid}`; await firebase_1.db.doc(`submissions/${id}`).set({ worksheetId, userId: u.uid, status: 'draft', answers, updatedAt: firebase_1.FieldValue.serverTimestamp() }, { merge: true }); return { ok: true, serverTime: Date.now() }; });
exports.submitDigitalWorksheet = (0, https_1.onCall)({ region }, async (req) => { const u = await (0, auth_1.requireActive)(req); if (u.role !== 'user')
    throw new https_1.HttpsError('permission-denied', 'User only'); const { worksheetId, answers = {} } = req.data; const w = await access(u.uid, u.classroomId, worksheetId); if (w.type !== 'digital')
    throw new https_1.HttpsError('failed-precondition', 'ไม่ใช่ Digital worksheet'); const override = await validOverride(u.uid, worksheetId); const { now, status } = enforceWindow(w, override); const id = `${worksheetId}_${u.uid}`; await firebase_1.db.doc(`submissions/${id}`).set({ worksheetId, userId: u.uid, status, answers, submittedAt: firebase_1.FieldValue.serverTimestamp(), updatedAt: firebase_1.FieldValue.serverTimestamp() }, { merge: true }); await (0, audit_1.audit)(u, 'SUBMIT_WORKSHEET', 'submission', id, { worksheetId, status }); return { ok: true, status, serverTime: now }; });
exports.confirmPaperSubmission = (0, https_1.onCall)({ region, secrets: [qrToken_1.qrTokenSecret] }, async (req) => { const u = await (0, auth_1.requireActive)(req); if (u.role !== 'user')
    throw new https_1.HttpsError('permission-denied', 'User only'); const { worksheetId, token } = req.data; if (!token)
    throw new https_1.HttpsError('invalid-argument', 'QR/Barcode token required'); let p; try {
    p = (0, qrToken_1.verifyPaperToken)(token);
}
catch {
    throw new https_1.HttpsError('invalid-argument', 'QR/Barcode ไม่ถูกต้อง');
} if (p.worksheetId !== worksheetId)
    throw new https_1.HttpsError('invalid-argument', 'รหัสไม่ตรงกับใบงาน'); if (p.userId && p.userId !== u.uid)
    throw new https_1.HttpsError('permission-denied', 'เอกสารนี้เป็นของ User คนอื่น'); const w = await access(u.uid, u.classroomId, worksheetId); if (w.type !== 'paper')
    throw new https_1.HttpsError('failed-precondition', 'ไม่ใช่ Paper worksheet'); const override = await validOverride(u.uid, worksheetId); const { now, status } = enforceWindow(w, override); const id = `${worksheetId}_${u.uid}`; const existing = await firebase_1.db.doc(`submissions/${id}`).get(); if (existing.exists && ['submitted', 'late', 'reviewed'].includes(existing.data()?.status))
    throw new https_1.HttpsError('already-exists', 'ยืนยันการส่งไปแล้ว'); await firebase_1.db.doc(`submissions/${id}`).set({ worksheetId, userId: u.uid, status, paperTokenNonce: p.nonce, submittedAt: firebase_1.FieldValue.serverTimestamp(), updatedAt: firebase_1.FieldValue.serverTimestamp() }, { merge: true }); await (0, audit_1.audit)(u, 'CONFIRM_PAPER_SUBMISSION', 'submission', id, { worksheetId, status }); return { ok: true, status, serverTime: now }; });
