"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedInitialSubjectsAndWorksheets = void 0;
const https_1 = require("firebase-functions/v2/https");
const firebase_1 = require("../shared/firebase");
const auth_1 = require("../shared/auth");
const audit_1 = require("../shared/audit");
const region = 'asia-southeast1';
const subjects = [
    { code: '20001-1001', name: 'สุขภาพความปลอดภัยและสิ่งแวดล้อม', colorCode: '#2563EB', type: 'subject' },
    { code: '20001-1004', name: 'กฎหมายแรงงาน', colorCode: '#7C3AED', type: 'subject' },
    { code: '21900-1005', name: 'เครือข่ายคอมพิวเตอร์', colorCode: '#0891B2', type: 'subject' },
    { code: '21901-2008', name: 'การออกแบบส่วนติดต่อผู้ใช้', colorCode: '#EA580C', type: 'subject' },
    { code: '21901-2017', name: 'เทคโนโลยีการนำเข้าข้อมูลเข้าสู่ระบบคอมพิวเตอร์', colorCode: '#16A34A', type: 'subject' },
    { code: '21901-2020', name: 'ปฏิบัติงานบริการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ', colorCode: '#DB2777', type: 'subject' },
    { code: '21910-2010', name: 'การเขียนโปรแกรมภาษาคอมพิวเตอร์', colorCode: '#4F46E5', type: 'subject' },
    { code: '31901-2001', name: 'การออกแบบส่วนติดต่อผู้ใช้ขั้นสูง', colorCode: '#9333EA', type: 'subject' },
    { code: '31901-2004', name: 'การพัฒนาซอฟต์แวร์ด้วยเทคโนโลยี Front-End', colorCode: '#0284C7', type: 'subject' },
    { code: '31901-2009', name: 'การพัฒนาซอฟต์แวร์สำหรับอุปกรณ์เคลื่อนที่', colorCode: '#0D9488', type: 'subject' },
    { code: '31910-0004', name: 'การเขียนโปรแกรมคอมพิวเตอร์', colorCode: '#CA8A04', type: 'subject' },
    { code: 'Home Room', name: 'กิจกรรมโฮมรูม', colorCode: '#64748B', type: 'activity' },
    { code: 'PLC', name: 'ชุมชนการเรียนรู้ทางวิชาชีพ', colorCode: '#475569', type: 'activity' }
];
const seeds = [
    { key: 'WS-D01', title: 'การประเมินความปลอดภัยในห้องปฏิบัติการคอมพิวเตอร์', subjectCode: '20001-1001', type: 'digital', totalScore: 10, description: 'ประเมินความปลอดภัย สายไฟ ถังดับเพลิง ความเสี่ยง และเหตุเครื่องดื่มหกใกล้คอมพิวเตอร์', instructions: 'ตอบคำถามให้ครบทุกข้อก่อนส่ง', questions: [
            { id: 'q1', type: 'singleChoice', prompt: 'วิธีจัดการสายไฟในห้องปฏิบัติการที่เหมาะสมที่สุดคือข้อใด', required: true, options: ['วางพาดทางเดิน', 'เก็บเข้ารางหรืออุปกรณ์จัดสาย', 'วางชิดแหล่งความร้อน'] },
            { id: 'q2', type: 'multipleChoice', prompt: 'อุปกรณ์ใดเกี่ยวข้องกับความปลอดภัยในห้องปฏิบัติการ', required: true, options: ['ถังดับเพลิง', 'ป้ายทางหนีไฟ', 'สายพ่วงชำรุด', 'ชุดปฐมพยาบาล'] },
            { id: 'q3', type: 'paragraph', prompt: 'อธิบายขั้นตอนเมื่อเครื่องดื่มหกใกล้คอมพิวเตอร์', required: true, maxLength: 500, pasteDisabled: true }
        ], answers: { q1: { type: 'singleChoice', value: 'เก็บเข้ารางหรืออุปกรณ์จัดสาย', score: 3 }, q2: { type: 'multipleChoice', value: ['ถังดับเพลิง', 'ป้ายทางหนีไฟ', 'ชุดปฐมพยาบาล'], score: 3 } } },
    { key: 'WS-D02', title: 'พื้นฐานระบบเครือข่ายคอมพิวเตอร์', subjectCode: '21900-1005', type: 'digital', totalScore: 10, description: 'LAN, Router, Switch, IP Address, Wi-Fi และการเปรียบเทียบ LAN กับ Wi-Fi', instructions: 'เลือกคำตอบและอธิบายให้ครบ', questions: [
            { id: 'q1', type: 'singleChoice', prompt: 'อุปกรณ์ใดใช้เชื่อมต่อหลายอุปกรณ์ใน LAN', required: true, options: ['Switch', 'Printer', 'UPS'] },
            { id: 'q2', type: 'shortAnswer', prompt: 'IP Address มีหน้าที่อะไร', required: true, maxLength: 200 },
            { id: 'q3', type: 'paragraph', prompt: 'เปรียบเทียบ LAN แบบสายกับ Wi-Fi', required: true, maxLength: 500 }
        ], answers: { q1: { type: 'singleChoice', value: 'Switch', score: 3 } } },
    { key: 'WS-D03', title: 'วิเคราะห์การออกแบบหน้าจอแอปพลิเคชัน', subjectCode: '21901-2008', type: 'digital', totalScore: 15, description: 'วิเคราะห์วัตถุประสงค์ ปุ่ม สี ปัญหาการใช้งาน และแนวทางปรับปรุงจากภาพ UI ที่ Admin แนบ', instructions: 'วิเคราะห์ UI อย่างเป็นเหตุผลและเสนอแนวทางปรับปรุง', questions: [
            { id: 'q1', type: 'shortAnswer', prompt: 'วัตถุประสงค์หลักของหน้าจอนี้คืออะไร', required: true, maxLength: 250 },
            { id: 'q2', type: 'paragraph', prompt: 'วิเคราะห์การใช้สีและลำดับความสำคัญของปุ่ม', required: true, maxLength: 700 },
            { id: 'q3', type: 'paragraph', prompt: 'เสนอแนวทางปรับปรุงอย่างน้อย 3 ข้อ', required: true, maxLength: 800 }
        ] },
    { key: 'WS-D04', title: 'ฝึกเขียนคำสั่งเงื่อนไข if...else', subjectCode: '21910-2010', type: 'digital', totalScore: 15, description: 'เลือกตอบ เติมคำตอบ วิเคราะห์โค้ด และเขียน JavaScript', instructions: 'ตอบคำถามและเขียนโค้ดตามโจทย์', questions: [
            { id: 'q1', type: 'singleChoice', prompt: 'คำสั่งใดใช้ตรวจสอบเงื่อนไขใน JavaScript', required: true, options: ['if', 'print', 'class'] },
            { id: 'q2', type: 'shortAnswer', prompt: 'ผลลัพธ์ของ if (5 > 3) คือเงื่อนไขเป็น true หรือ false', required: true, maxLength: 50 },
            { id: 'q3', type: 'codeEditor', prompt: 'เขียนโปรแกรมรับคะแนนและแสดง Pass เมื่อคะแนน >= 50', required: true, pasteDisabled: true }
        ], answers: { q1: { type: 'singleChoice', value: 'if', score: 3 }, q2: { type: 'shortAnswer', value: 'true', score: 2 } } },
    { key: 'WS-D05', title: 'สร้างหน้าเว็บแนะนำตนเอง', subjectCode: '31901-2004', type: 'digital', totalScore: 20, description: 'สร้างหน้า HTML/CSS ที่มีหัวข้อ ข้อมูลแนะนำตัว รูปภาพ ความสนใจ CSS และโครงสร้าง HTML', instructions: 'ห้ามใส่ข้อมูลส่วนบุคคลละเอียดอ่อน', questions: [
            { id: 'q1', type: 'codeEditor', prompt: 'เขียน HTML/CSS สำหรับหน้าแนะนำตนเอง', required: true, pasteDisabled: false },
            { id: 'q2', type: 'fileUpload', prompt: 'อัปโหลดไฟล์งาน .html หรือ .zip ตามที่ Admin กำหนด', required: false }
        ] },
    { key: 'WS-D06', title: 'แบบทดสอบพื้นฐานการเขียนโปรแกรมคอมพิวเตอร์', subjectCode: '31910-0004', type: 'digital', totalScore: 15, description: 'ตัวแปร ชนิดข้อมูล ตัวดำเนินการ การอ่านผลลัพธ์โค้ด และขั้นตอนวิธี', instructions: 'ตอบคำถามให้ครบ', questions: [
            { id: 'q1', type: 'singleChoice', prompt: 'ข้อใดคือตัวแปรที่ตั้งชื่อได้ถูกต้อง', required: true, options: ['2name', 'studentName', 'first-name'] },
            { id: 'q2', type: 'multipleChoice', prompt: 'ข้อใดเป็นชนิดข้อมูลพื้นฐาน', required: true, options: ['string', 'number', 'boolean', 'router'] },
            { id: 'q3', type: 'paragraph', prompt: 'อธิบายความหมายของขั้นตอนวิธี (Algorithm)', required: true, maxLength: 500 }
        ], answers: { q1: { type: 'singleChoice', value: 'studentName', score: 3 }, q2: { type: 'multipleChoice', value: ['string', 'number', 'boolean'], score: 3 } } },
    { key: 'WS-P01', title: 'สิทธิและหน้าที่ตามกฎหมายแรงงาน', subjectCode: '20001-1004', type: 'paper', totalScore: 10, description: 'นายจ้าง ลูกจ้าง สิทธิของลูกจ้าง การทำงานล่วงเวลา และข้อพิพาท', instructions: 'ทำลงในเอกสารและสแกน QR/Barcode เพื่อยืนยันส่ง', questions: [{ id: 'q1', type: 'paragraph', prompt: 'อธิบายสิทธิและหน้าที่พื้นฐานของนายจ้างและลูกจ้าง', required: true }, { id: 'q2', type: 'paragraph', prompt: 'ยกตัวอย่างกรณีการทำงานล่วงเวลาและแนวทางจัดการข้อพิพาท', required: true }] },
    { key: 'WS-P02', title: 'ออกแบบแบบฟอร์มการนำเข้าข้อมูล', subjectCode: '21901-2017', type: 'paper', totalScore: 15, description: 'วาดแบบฟอร์ม ระบุชนิดข้อมูล ช่องบังคับกรอก และแนวทางป้องกันข้อมูลผิดพลาด', instructions: 'ออกแบบบนกระดาษ A4 พร้อมคำอธิบาย', questions: [{ id: 'q1', type: 'drawingArea', prompt: 'วาดแบบฟอร์มการนำเข้าข้อมูล', required: true }, { id: 'q2', type: 'paragraph', prompt: 'ระบุชนิดข้อมูลและ validation ของแต่ละช่อง', required: true }] },
    { key: 'WS-P03', title: 'ขั้นตอนการให้บริการคอมพิวเตอร์', subjectCode: '21901-2020', type: 'paper', totalScore: 10, description: 'เรียงลำดับขั้นตอนการบริการ วิเคราะห์ปัญหาคอมพิวเตอร์ และสรุปผลการให้บริการ', instructions: 'ตอบลงในใบงานพิมพ์', questions: [{ id: 'q1', type: 'paragraph', prompt: 'เรียงลำดับขั้นตอนการรับงานบริการคอมพิวเตอร์', required: true }, { id: 'q2', type: 'paragraph', prompt: 'วิเคราะห์ปัญหาตัวอย่างและสรุปผลการบริการ', required: true }] },
    { key: 'WS-P04', title: 'ออกแบบ Wireframe หน้าจอระบบ', subjectCode: '31901-2001', type: 'paper', totalScore: 20, description: 'ออกแบบ Wireframe ระบบยืมคืนอุปกรณ์คอมพิวเตอร์', instructions: 'วาด Wireframe และอธิบายการใช้งาน', questions: [{ id: 'q1', type: 'drawingArea', prompt: 'วาด Wireframe ระบบยืมคืนอุปกรณ์อย่างน้อย 3 หน้าจอ', required: true }] },
    { key: 'WS-P05', title: 'วางแผนแอปพลิเคชันบนอุปกรณ์เคลื่อนที่', subjectCode: '31901-2009', type: 'paper', totalScore: 20, description: 'ระบุชื่อแอป ปัญหา กลุ่มเป้าหมาย ฟังก์ชันหลัก และวาดอย่างน้อย 3 หน้าจอ', instructions: 'วิเคราะห์และออกแบบบนใบงาน', questions: [{ id: 'q1', type: 'paragraph', prompt: 'ระบุชื่อแอป ปัญหา กลุ่มเป้าหมาย และฟังก์ชันหลัก', required: true }, { id: 'q2', type: 'drawingArea', prompt: 'วาดอย่างน้อย 3 หน้าจอ', required: true }] },
    { key: 'WS-P06', title: 'หลักการใช้สีและตัวอักษรใน UI', subjectCode: '21901-2008', type: 'paper', totalScore: 15, description: 'วิเคราะห์สี ตัวอักษร ปัญหา UI และเสนอแนวทางปรับปรุง', instructions: 'วิเคราะห์ตัวอย่าง UI ที่ครูมอบหมาย', questions: [{ id: 'q1', type: 'paragraph', prompt: 'วิเคราะห์การใช้สีและ Contrast', required: true }, { id: 'q2', type: 'paragraph', prompt: 'วิเคราะห์ตัวอักษรและเสนอแนวทางปรับปรุง', required: true }] }
];
async function resolveSubjectId(s, overwrite) { const q = await firebase_1.db.collection('subjects').where('code', '==', s.code).limit(1).get(); if (!q.empty) {
    if (overwrite)
        await q.docs[0].ref.set({ ...s, active: true, academicYear: 2569, semester: 1, updatedAt: firebase_1.FieldValue.serverTimestamp() }, { merge: true });
    return q.docs[0].id;
} const ref = firebase_1.db.collection('subjects').doc(); await ref.set({ ...s, active: true, academicYear: 2569, semester: 1, createdAt: firebase_1.FieldValue.serverTimestamp(), updatedAt: firebase_1.FieldValue.serverTimestamp() }); return ref.id; }
exports.seedInitialSubjectsAndWorksheets = (0, https_1.onCall)({ region, timeoutSeconds: 180 }, async (req) => {
    const a = await (0, auth_1.requireAdmin)(req);
    const overwrite = req.data?.overwrite === true;
    const subjectIds = new Map();
    for (const s of subjects)
        subjectIds.set(s.code, await resolveSubjectId(s, overwrite));
    let created = 0, skipped = 0;
    for (const seed of seeds) {
        const exists = await firebase_1.db.collection('worksheets').where('seedKey', '==', seed.key).limit(1).get();
        if (!exists.empty && !overwrite) {
            skipped++;
            continue;
        }
        const sub = subjects.find(s => s.code === seed.subjectCode);
        const ref = exists.empty ? firebase_1.db.collection('worksheets').doc() : exists.docs[0].ref;
        const batch = firebase_1.db.batch();
        batch.set(ref, { seedKey: seed.key, subjectId: subjectIds.get(seed.subjectCode), subjectCode: seed.subjectCode, subjectName: sub.name, subjectColor: sub.colorCode, title: seed.title, type: seed.type, status: 'draft', description: seed.description, instructions: seed.instructions, questions: seed.questions, targetClassroomIds: [], targetUserIds: [], allowLate: false, allowResubmit: false, maxAttempts: 1, saveDraftEnabled: seed.type === 'digital', createdBy: a.uid, createdAt: firebase_1.FieldValue.serverTimestamp(), updatedAt: firebase_1.FieldValue.serverTimestamp() }, { merge: true });
        batch.set(firebase_1.db.doc(`worksheetAnswerKeys/${ref.id}`), { worksheetId: ref.id, totalScore: seed.totalScore, answers: seed.answers || {}, updatedAt: firebase_1.FieldValue.serverTimestamp() }, { merge: true });
        await batch.commit();
        created++;
    }
    await (0, audit_1.audit)(a, 'SEED_INITIAL_DATA', 'system', 'seed-v2', { createdWorksheets: created, skipped, overwrite });
    return { ok: true, subjects: subjects.length, createdWorksheets: created, skipped };
});
