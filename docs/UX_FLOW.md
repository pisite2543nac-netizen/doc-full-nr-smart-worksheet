# UX Flow / User Journey

## User
Login → Dashboard → ใบงานของฉัน → รายละเอียด → Digital: เริ่มทำ/บันทึกร่าง/ส่ง หรือ Paper: ดู PDF/พิมพ์/สแกน → Server ตรวจสิทธิ์และเวลา → Success → กลับรายการ.

หลักการ: ไม่แสดงคะแนน, grade, answer key, rubric หรือ comment ของ Admin ใน User UI/API/Firestore read.

## Admin
Login → Dashboard → Users / Classrooms / Subjects → Worksheets → Stepper Create/Edit → Publish → ดู Submission → Grade/Rubric → Reports/Export → Audit Log.

## Deadline
Client ใช้ server offset เพื่อแสดง countdown เท่านั้น. การตัดสินว่า submit ได้หรือไม่ต้องทำซ้ำใน Cloud Function ทุกครั้ง.
