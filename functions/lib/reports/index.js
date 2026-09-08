"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportReport = void 0;
const https_1 = require("firebase-functions/v2/https");
const firebase_1 = require("../shared/firebase");
const auth_1 = require("../shared/auth");
const audit_1 = require("../shared/audit");
const region = 'asia-southeast1';
const esc = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;
exports.exportReport = (0, https_1.onCall)({ region, timeoutSeconds: 120 }, async (req) => { const a = await (0, auth_1.requireAdmin)(req); const { type = 'submissions', limit = 1000 } = req.data; const snap = await firebase_1.db.collection('submissions').limit(Math.min(Number(limit) || 1000, 5000)).get(); const rows = [['submissionId', 'worksheetId', 'userId', 'status', 'submittedAt']]; for (const d of snap.docs) {
    const x = d.data();
    rows.push([d.id, x.worksheetId, x.userId, x.status, x.submittedAt?.toDate?.().toISOString?.() ?? '']);
} const csv = '\ufeff' + rows.map(r => r.map(esc).join(',')).join('\n'); await (0, audit_1.audit)(a, 'EXPORT_REPORT', 'report', type, { count: snap.size }); return { fileName: `report-${type}-${new Date().toISOString().slice(0, 10)}.csv`, csv, count: snap.size }; });
