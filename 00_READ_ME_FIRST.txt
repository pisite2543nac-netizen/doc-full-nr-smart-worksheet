DOC-FULL-NR SMART WORKSHEET - GITHUB UPLOAD BUNDLE

ไฟล์ชุดนี้รวม 6 ชุดไว้ใน ZIP เดียว และแยกเป็นโฟลเดอร์ตามลำดับสำหรับอัปโหลดทีละส่วน

ลำดับโฟลเดอร์:
01_ROOT_CONFIG_FIREBASE
02_WEB_CORE_AUTH
03_WEB_USER_UI
04_WEB_ADMIN_UI
05_CLOUD_FUNCTIONS
06_GITHUB_ACTIONS_DOCS

วิธีใช้กับ GitHub Repository เดิม:
1) แตก ZIP นี้บนเครื่อง
2) เปิด Repository local เดิมของคุณ
3) คัดลอก "เนื้อหาภายใน" โฟลเดอร์ 01 ไปวางที่ ROOT ของ Repository
4) ทำแบบเดียวกันกับ 02, 03, 04, 05, 06 ตามลำดับ
5) ถ้ามีคำถาม Replace/Merge ให้เลือก Merge/Replace ตามไฟล์เวอร์ชันใหม่นี้
6) อย่านำชื่อโฟลเดอร์ 01_... / 02_... ขึ้นไปครอบ Source Code ใน Repository เพราะโครงสร้างจริงต้องอยู่ที่ root เช่น apps/, functions/, .github/, firebase.json
7) ห้ามอัปโหลด .env.local, service account keys, private keys หรือรหัสผ่าน

สำหรับ GitHub Pages:
- หลังอัปโหลดครบ ให้ตั้ง Settings > Pages > Source = GitHub Actions
- ตรวจ Actions ให้ CI และ Deploy Pages ผ่าน

หมายเหตุ:
โฟลเดอร์ย่อยนี้มีไว้ช่วยทยอยคัดลอก/อัปโหลดเท่านั้น ไม่ใช่โครงสร้างสุดท้ายที่ควรคงไว้บน Repository
