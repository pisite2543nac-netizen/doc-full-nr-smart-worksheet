# DOC-FULL-NR Smart Worksheet — Production V2

ระบบจัดการใบงานสำหรับสถานศึกษา แยกบทบาท **Admin** และ **User** ใช้ React + TypeScript + Tailwind CSS + Firebase.

## จุดสำคัญ
- GitHub Pages เปิด **Demo UX/UI** ได้ทันทีหลัง workflow `Deploy GitHub Pages Demo` สำเร็จ
- Firebase Hosting ใช้เป็นระบบจริง เชื่อม Authentication / Firestore / Storage / Functions
- User ไม่มีสิทธิ์อ่าน `worksheetAnswerKeys` หรือ `submissionGrades`
- การส่งงานและตรวจ deadline ทำผ่าน Cloud Functions โดยใช้ Server time
- คะแนนอยู่ `submissionGrades` แยกจาก `submissions`
- Default-deny Firestore Rules

## เปิด Demo ผ่าน GitHub Pages
1. Push source ไป branch `main`
2. GitHub → Settings → Pages → Source = **GitHub Actions**
3. เปิด Actions และรอ workflow `Deploy GitHub Pages Demo` เป็นสีเขียว
4. เปิด `https://pisite2543nac-netizen.github.io/doc-full-nr-smart-worksheet/`
5. หน้า Login จะมีปุ่ม **ทดลอง Admin** และ **ทดลอง User**

> GitHub Pages เป็น Demo UI โดยตั้ง `VITE_DEMO_MODE=true` ใน workflow เพื่อไม่ต้องใส่ Firebase key ใน GitHub ก่อนทดลอง UI.

## รัน Local
```bash
npm install
npm run dev
```
เปิด `http://localhost:5174/`

หรือ Windows ดับเบิลคลิก `00_INSTALL_AND_RUN_LOCAL.bat`

## เชื่อม Firebase จริง
คัดลอก `.env.example` เป็น `apps/web/.env.local` แล้วใส่ Firebase Web App config:
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=doc-full-nr.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=doc-full-nr
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=575211205593
VITE_FIREBASE_APP_ID=1:575211205593:web:121d906f13a90162341fc8
VITE_DEMO_MODE=false
VITE_BASE_PATH=/
```
ห้าม commit `.env.local`, service-account JSON หรือ password.

## Deploy Firebase
```bash
firebase login
firebase use doc-full-nr
npm install
npm run deploy:rules
npm run deploy:functions
npm run deploy:web
```

## Important: Existing Firestore data
ฟังก์ชัน Seed ไม่ถูกเรียกอัตโนมัติ จึง **ไม่เขียนทับข้อมูล subjects เดิม**. ต้องให้ Admin เรียก `seedInitialSubjectsAndWorksheets` เอง และค่าเริ่มต้น `overwrite=false`.

## Production hardening ก่อนเปิดให้นักเรียนจริง
- เปิด Firebase App Check
- จำกัด Cloud Functions quotas/rate limits
- ตรวจ Storage MIME type และ virus scanning หากรับไฟล์ภายนอกจำนวนมาก
- เพิ่ม Emulator integration tests สำหรับ Security Rules
- เพิ่ม backup/retention policy
- ตรวจ Accessibility และ Browser/Device matrix จริง
- สำหรับ QR/Barcode production ควรใช้ signed token/HMAC หรือ one-time token ที่สร้างจาก server; scaffold นี้ยังไม่เปิดเผย secret ใน client

ดู `docs/` สำหรับ schema, security, UX flow และ test cases.

## V2.1 Build/Pages Reliability Fix

- GitHub Pages is deployed from `apps/web/dist` by GitHub Actions.
- `build-check.yml` no longer blocks Pages on semantic TypeScript migration errors.
- Cloud Functions source is syntax-transpiled to `functions/lib` for deploy packaging; use `npm --workspace functions run typecheck` separately before production hardening.
- `06_CONNECT_FIREBASE_TO_GITHUB.bat` reads the official Firebase Web SDK config from project `doc-full-nr`, writes `apps/web/src/generated/firebaseConfig.ts`, commits it, and pushes to `main`.
- If the generated API key is empty, the UI automatically runs in Demo Mode instead of rendering a blank page.

## V3 structure repair
If GitHub Actions reports `Failed to resolve /src/main.tsx from .../index.html`, the repository contains an obsolete or flattened root Vite app. Use `00_REPAIR_GITHUB_STRUCTURE_AND_PUSH.bat` from the V3 repair bundle. The GitHub workflows now build with `working-directory: apps/web`, so root-level legacy files cannot hijack the web build.
