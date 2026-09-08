"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishWorksheet = exports.updateWorksheet = exports.createWorksheet = void 0;
const https_1 = require("firebase-functions/v2/https");
const firebase_1 = require("../shared/firebase");
const auth_1 = require("../shared/auth");
const audit_1 = require("../shared/audit");
const region = 'asia-southeast1';
function splitWorksheetPayload(input) {
    const data = { ...input };
    const totalScore = Number(data.totalScore ?? 0);
    const answerKey = data.answerKey ?? data.answers ?? undefined;
    delete data.totalScore;
    delete data.answerKey;
    delete data.answers;
    delete data.score;
    delete data.rubricScores;
    delete data.comment;
    delete data.gradedBy;
    delete data.gradedAt;
    return { publicData: data, privateData: { totalScore, answers: answerKey ?? {} } };
}
exports.createWorksheet = (0, https_1.onCall)({ region }, async (req) => {
    const a = await (0, auth_1.requireAdmin)(req);
    const { publicData, privateData } = splitWorksheetPayload(req.data);
    if (!publicData.title || !publicData.subjectId)
        throw new https_1.HttpsError('invalid-argument', 'ข้อมูลใบงานไม่ครบ');
    const ref = firebase_1.db.collection('worksheets').doc();
    const batch = firebase_1.db.batch();
    batch.set(ref, { ...publicData, status: 'draft', createdBy: a.uid, createdAt: firebase_1.FieldValue.serverTimestamp(), updatedAt: firebase_1.FieldValue.serverTimestamp() });
    batch.set(firebase_1.db.doc(`worksheetAnswerKeys/${ref.id}`), { worksheetId: ref.id, ...privateData, createdAt: firebase_1.FieldValue.serverTimestamp(), updatedAt: firebase_1.FieldValue.serverTimestamp() });
    await batch.commit();
    await (0, audit_1.audit)(a, 'CREATE_WORKSHEET', 'worksheet', ref.id);
    return { id: ref.id };
});
exports.updateWorksheet = (0, https_1.onCall)({ region }, async (req) => {
    const a = await (0, auth_1.requireAdmin)(req);
    const { id, ...rest } = req.data;
    if (!id)
        throw new https_1.HttpsError('invalid-argument', 'worksheet id required');
    const { publicData, privateData } = splitWorksheetPayload(rest);
    const batch = firebase_1.db.batch();
    batch.update(firebase_1.db.doc(`worksheets/${id}`), { ...publicData, updatedAt: firebase_1.FieldValue.serverTimestamp() });
    batch.set(firebase_1.db.doc(`worksheetAnswerKeys/${id}`), { worksheetId: id, ...privateData, updatedAt: firebase_1.FieldValue.serverTimestamp() }, { merge: true });
    await batch.commit();
    await (0, audit_1.audit)(a, 'UPDATE_WORKSHEET', 'worksheet', id);
    return { ok: true };
});
exports.publishWorksheet = (0, https_1.onCall)({ region }, async (req) => {
    const a = await (0, auth_1.requireAdmin)(req);
    const { id } = req.data;
    const ref = firebase_1.db.doc(`worksheets/${id}`), s = await ref.get();
    if (!s.exists)
        throw new https_1.HttpsError('not-found', 'ไม่พบใบงาน');
    const w = s.data();
    if (!w.opensAt || !w.dueAt || (!(w.targetClassroomIds?.length) && !(w.targetUserIds?.length)))
        throw new https_1.HttpsError('failed-precondition', 'ต้องกำหนดกลุ่มเป้าหมาย วันเปิด และกำหนดส่ง');
    await ref.update({ status: 'published', publishedAt: firebase_1.FieldValue.serverTimestamp(), updatedAt: firebase_1.FieldValue.serverTimestamp() });
    await (0, audit_1.audit)(a, 'PUBLISH_WORKSHEET', 'worksheet', id);
    return { ok: true };
});
