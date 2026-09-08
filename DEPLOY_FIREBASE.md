# Deploy Firebase Production

1. สร้าง `apps/web/.env.local` จาก `.env.example` และใส่ Firebase Web App config จริง.
2. Firebase Console → Authentication → Email/Password = Enabled.
3. Authorized domains: `doc-full-nr.web.app`, `localhost`; ถ้าจะให้ GitHub Pages เชื่อม Firebase จริง ให้เพิ่ม `pisite2543nac-netizen.github.io`.
4. Deploy rules ก่อน: `03_DEPLOY_RULES.bat`.
5. Deploy Functions: `04_DEPLOY_FUNCTIONS.bat`.
6. Deploy Web: `02_DEPLOY_FIREBASE_WEB.bat`.
7. ทดสอบ `https://doc-full-nr.web.app/`.

ห้ามใส่ Admin password, service-account JSON หรือ token ใน GitHub.

## QR/Barcode secret
ก่อน Deploy Functions ครั้งแรก ให้รัน `05_SET_QR_SECRET.bat` และตั้งค่า `QR_TOKEN_SECRET` เป็นค่าสุ่มยาวที่เดายาก. ห้าม commit ค่านี้ลง GitHub.

## Thai PDF font
ฟังก์ชัน PDF รองรับการโหลดฟอนต์ไทยจาก Firebase Storage path `system/fonts/Sarabun-Regular.ttf`. Source package ไม่รวมไฟล์ฟอนต์; ให้อัปโหลดฟอนต์ที่คุณมีสิทธิ์ใช้งานไปยัง path นี้. หากไม่มี ระบบจะ fallback เป็น Helvetica และข้อความไทยใน PDF อาจแสดงเป็น `?`.
