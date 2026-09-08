"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoGradeWorksheet = exports.gradeSubmission = void 0;
const https_1 = require("firebase-functions/v2/https");
const firebase_1 = require("../shared/firebase");
const auth_1 = require("../shared/auth");
const audit_1 = require("../shared/audit");
const region = 'asia-southeast1';
exports.gradeSubmission = (0, https_1.onCall)({ region }, async (req) => { const a = await (0, auth_1.requireAdmin)(req); const { submissionId, totalScore, rubricScores = [], comment = '', final = true } = req.data; if (!submissionId || typeof totalScore !== 'number' || totalScore < 0)
    throw new https_1.HttpsError('invalid-argument', 'คะแนนไม่ถูกต้อง'); const sub = await firebase_1.db.doc(`submissions/${submissionId}`).get(); if (!sub.exists)
    throw new https_1.HttpsError('not-found', 'ไม่พบ submission'); const wsid = sub.data().worksheetId; const privateWs = await firebase_1.db.doc(`worksheetAnswerKeys/${wsid}`).get(); const max = Number(privateWs.data()?.totalScore ?? Number.MAX_SAFE_INTEGER); if (totalScore > max)
    throw new https_1.HttpsError('invalid-argument', 'คะแนนรวมเกินคะแนนเต็ม'); await firebase_1.db.doc(`submissionGrades/${submissionId}`).set({ submissionId, totalScore, rubricScores, comment, status: final ? 'final' : 'draft', gradedBy: a.uid, gradedAt: firebase_1.FieldValue.serverTimestamp(), updatedAt: firebase_1.FieldValue.serverTimestamp() }, { merge: true }); await firebase_1.db.doc(`submissions/${submissionId}`).update({ status: final ? 'reviewed' : 'pending_review', updatedAt: firebase_1.FieldValue.serverTimestamp() }); await (0, audit_1.audit)(a, 'GRADE_SUBMISSION', 'submissionGrade', submissionId, { final }); return { ok: true }; });
function normalize(v) { if (Array.isArray(v))
    return [...v].map(String).sort(); return String(v ?? '').trim().toLowerCase(); }
function equal(a, b) { if (Array.isArray(a) || Array.isArray(b))
    return JSON.stringify(normalize(a)) === JSON.stringify(normalize(b)); return normalize(a) === normalize(b); }
exports.autoGradeWorksheet = (0, https_1.onCall)({ region, timeoutSeconds: 120 }, async (req) => { const a = await (0, auth_1.requireAdmin)(req); const { worksheetId } = req.data; const key = await firebase_1.db.doc(`worksheetAnswerKeys/${worksheetId}`).get(); if (!key.exists)
    throw new https_1.HttpsError('failed-precondition', 'ไม่มี answer key'); const k = key.data(); const rules = k.answers || {}; const subs = await firebase_1.db.collection('submissions').where('worksheetId', '==', worksheetId).get(); let graded = 0; for (const d of subs.docs) {
    const sub = d.data();
    if (!['submitted', 'late', 'pending_review'].includes(sub.status))
        continue;
    let score = 0;
    const breakdown = [];
    for (const [qid, ruleAny] of Object.entries(rules)) {
        const rule = ruleAny;
        if (!['singleChoice', 'multipleChoice', 'shortAnswer'].includes(rule.type))
            continue;
        const ok = equal(sub.answers?.[qid], rule.value);
        const earned = ok ? Number(rule.score || 0) : 0;
        score += earned;
        breakdown.push({ questionId: qid, earned, max: Number(rule.score || 0), auto: true });
    }
    await firebase_1.db.doc(`submissionGrades/${d.id}`).set({ submissionId: d.id, totalScore: score, rubricScores: breakdown, comment: '', status: 'draft', autoGraded: true, gradedBy: a.uid, gradedAt: firebase_1.FieldValue.serverTimestamp(), updatedAt: firebase_1.FieldValue.serverTimestamp() }, { merge: true });
    await firebase_1.db.doc(`submissions/${d.id}`).update({ status: 'pending_review', updatedAt: firebase_1.FieldValue.serverTimestamp() });
    graded++;
} await (0, audit_1.audit)(a, 'AUTO_GRADE_WORKSHEET', 'worksheet', worksheetId, { graded }); return { ok: true, graded }; });
