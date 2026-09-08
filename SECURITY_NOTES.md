# Security Notes

- Default deny เป็นฐานของ Firestore/Storage rules.
- Role authoritative ควรมาจาก server + user profile; การเปลี่ยน role ใช้ Admin Function.
- Deadline ไม่เชื่อ client clock.
- คะแนน/ความคิดเห็นแยก collection และ User ไม่มี read.
- Answer key แยก collection และ User ไม่มี read.
- Audit log server-only write.
- Export server-only.
- QR/Barcode production ต้องเป็น signed/one-time token; ฟังก์ชันใน scaffold แสดงจุดเชื่อมต่อ แต่ต้องเพิ่ม cryptographic validation ก่อนเปิดจริง.
- File upload: ตรวจ MIME/size ฝั่ง Storage Rules และตรวจซ้ำ server หากใช้ในการประมวลผล.
- เปิด App Check ก่อน production rollout.
