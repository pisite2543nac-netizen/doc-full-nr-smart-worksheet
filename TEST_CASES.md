# Security & Functional Test Cases

1. User อ่าน `users/{otherUid}` → DENY.
2. User แก้ role/isActive/classroomId ของตน → DENY.
3. User อ่าน worksheet draft → DENY.
4. User อ่าน published worksheet ที่ไม่ได้ assigned → DENY.
5. User อ่าน `worksheetAnswerKeys/*` → DENY.
6. User อ่าน `submissionGrades/*` → DENY.
7. User อ่าน submission ของคนอื่น → DENY.
8. Client เขียน submissions ตรง → DENY; ต้องใช้ Cloud Function.
9. Submit ก่อน opensAt → Function reject.
10. Submit หลัง dueAt และไม่ allowLate/override → Function reject.
11. Submit หลัง dueAt แต่มี valid override → ผ่านและ status late.
12. User เรียก gradeSubmission → permission-denied.
13. Admin grade → เก็บคะแนนเฉพาะ submissionGrades + audit.
14. ExportReport โดย User → permission-denied.
15. Seed โดย User → permission-denied.
16. Paper token ผิด → Production ต้อง reject ตาม signed-token validator ก่อนใช้งานจริง.
17. ปิดบัญชี isActive=false → Login/session ถูกปฏิเสธ.
18. GitHub Pages Demo เปิดได้โดยไม่มี Firebase config และไม่มีหน้าขาว.
19. Mobile 320px: Bottom nav ไม่ล้น, form อ่านได้.
20. Keyboard: ปุ่ม/ฟอร์ม/Modal ต้องเข้าถึงได้ และ Esc ปิด modal ที่เพิ่มใน production.
