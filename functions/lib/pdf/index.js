"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMyPaperWorksheetPdf = exports.generatePaperWorksheetPdf = void 0;
const https_1 = require("firebase-functions/v2/https");
const node_crypto_1 = __importDefault(require("node:crypto"));
const pdf_lib_1 = require("pdf-lib");
const fontkit_1 = __importDefault(require("@pdf-lib/fontkit"));
const qrcode_1 = __importDefault(require("qrcode"));
const auth_1 = require("../shared/auth");
const firebase_1 = require("../shared/firebase");
const audit_1 = require("../shared/audit");
const qrToken_1 = require("../shared/qrToken");
const time_1 = require("../shared/time");
const region = 'asia-southeast1';
const bwipjs = require('bwip-js');
async function getThaiFont(pdf) { try {
    pdf.registerFontkit(fontkit_1.default);
    const [bytes] = await firebase_1.bucket.file('system/fonts/Sarabun-Regular.ttf').download();
    return await pdf.embedFont(bytes, { subset: true });
}
catch {
    return await pdf.embedFont(pdf_lib_1.StandardFonts.Helvetica);
} }
function safeText(font, text) { try {
    font.encodeText(text);
    return text;
}
catch {
    return text.replace(/[^\x20-\x7E]/g, '?');
} }
async function buildPdf(worksheetId, userId, codeType) {
    const ws = await firebase_1.db.doc(`worksheets/${worksheetId}`).get();
    if (!ws.exists)
        throw new https_1.HttpsError('not-found', 'ไม่พบใบงาน');
    const w = ws.data();
    const privateSnap = await firebase_1.db.doc(`worksheetAnswerKeys/${worksheetId}`).get();
    const totalScore = privateSnap.data()?.totalScore ?? 0;
    const pdf = await pdf_lib_1.PDFDocument.create(), page = pdf.addPage([595.28, 841.89]), font = await getThaiFont(pdf);
    const hex = (w.subjectColor || '#2563EB').replace('#', '');
    const c = (0, pdf_lib_1.rgb)(parseInt(hex.slice(0, 2), 16) / 255, parseInt(hex.slice(2, 4), 16) / 255, parseInt(hex.slice(4, 6), 16) / 255);
    page.drawRectangle({ x: 0, y: 790, width: 595.28, height: 52, color: c });
    page.drawText(safeText(font, 'Nangrong Smart Worksheet'), { x: 38, y: 808, size: 17, font, color: (0, pdf_lib_1.rgb)(1, 1, 1) });
    page.drawText(safeText(font, `${w.subjectCode || ''}  ${w.subjectName || ''}`), { x: 38, y: 758, size: 11, font });
    page.drawText(safeText(font, String(w.title || 'Worksheet')), { x: 38, y: 730, size: 16, font });
    page.drawText(safeText(font, `คะแนนเต็ม: ${totalScore}`), { x: 38, y: 704, size: 10, font });
    if (userId) {
        const us = await firebase_1.db.doc(`users/${userId}`).get();
        const u = us.data() || {};
        page.drawText(safeText(font, `ชื่อ: ${u.displayName || '-'}   รหัส: ${u.studentId || '-'}   ห้อง: ${u.classroomName || u.classroomId || '-'}`), { x: 38, y: 680, size: 10, font });
    }
    let y = 630;
    for (const q of (w.questions || []).slice(0, 8)) {
        page.drawText(safeText(font, `${q.id || ''}. ${q.prompt || ''}`), { x: 38, y, size: 10, font, maxWidth: 340 });
        y -= 58;
        page.drawLine({ start: { x: 38, y: y + 20 }, end: { x: 380, y: y + 20 }, thickness: .5, color: (0, pdf_lib_1.rgb)(.75, .78, .82) });
    }
    const token = (0, qrToken_1.signPaperToken)({ worksheetId, userId: userId || undefined, issuedAt: Date.now(), nonce: node_crypto_1.default.randomUUID() });
    let img;
    if (codeType === 'barcode') {
        const png = await bwipjs.toBuffer({ bcid: 'code128', text: token, scale: 2, height: 12, includetext: false });
        img = await pdf.embedPng(png);
    }
    else {
        const png = await qrcode_1.default.toBuffer(token, { type: 'png', margin: 1, width: 300, errorCorrectionLevel: 'M' });
        img = await pdf.embedPng(png);
    }
    page.drawImage(img, { x: 420, y: 620, width: 125, height: 125 });
    page.drawText(safeText(font, `REF: ${worksheetId}`), { x: 38, y: 56, size: 9, font });
    page.drawText(safeText(font, 'ลงชื่อผู้ส่ง ____________________    ผู้รับ/ผู้ตรวจ ____________________'), { x: 38, y: 34, size: 9, font });
    return Buffer.from(await pdf.save());
}
exports.generatePaperWorksheetPdf = (0, https_1.onCall)({ region, timeoutSeconds: 120, memory: '512MiB', secrets: [qrToken_1.qrTokenSecret] }, async (req) => { const a = await (0, auth_1.requireAdmin)(req); const { worksheetId, userId, codeType = 'qr' } = req.data; const bytes = await buildPdf(worksheetId, userId, codeType); const name = `generated-pdf/${worksheetId}/${userId || 'blank'}-${Date.now()}.pdf`; await firebase_1.bucket.file(name).save(bytes, { contentType: 'application/pdf', metadata: { cacheControl: 'private,max-age=0' } }); await (0, audit_1.audit)(a, 'GENERATE_PDF', 'worksheet', worksheetId, { userId: userId || null, file: name, codeType }); return { ok: true, path: name }; });
exports.generateMyPaperWorksheetPdf = (0, https_1.onCall)({ region, timeoutSeconds: 120, memory: '512MiB', secrets: [qrToken_1.qrTokenSecret] }, async (req) => { const u = await (0, auth_1.requireActive)(req); if (u.role !== 'user')
    throw new https_1.HttpsError('permission-denied', 'User only'); const { worksheetId, codeType = 'qr' } = req.data; const ws = await firebase_1.db.doc(`worksheets/${worksheetId}`).get(); if (!ws.exists)
    throw new https_1.HttpsError('not-found', 'ไม่พบใบงาน'); const w = ws.data(); if (w.status !== 'published' || w.type !== 'paper')
    throw new https_1.HttpsError('failed-precondition', 'ใบงานยังไม่พร้อม'); if (!(w.targetUserIds || []).includes(u.uid) && !(w.targetClassroomIds || []).includes(u.classroomId))
    throw new https_1.HttpsError('permission-denied', 'ไม่มีสิทธิ์'); const open = (0, time_1.toMs)(w.opensAt); if (open && Date.now() < open)
    throw new https_1.HttpsError('failed-precondition', 'ยังไม่ถึงเวลาเปิด'); const bytes = await buildPdf(worksheetId, u.uid, codeType); const name = `user-paper/${u.uid}/${worksheetId}/worksheet-${Date.now()}.pdf`; await firebase_1.bucket.file(name).save(bytes, { contentType: 'application/pdf', metadata: { cacheControl: 'private,max-age=0' } }); return { ok: true, path: name }; });
