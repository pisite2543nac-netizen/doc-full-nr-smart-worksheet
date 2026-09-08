# Firestore Schema

## users/{uid}
`email, displayName, role(admin|user), isActive, studentId, classroomId, photoURL, createdAt, updatedAt`

## classrooms/{id}
`name, level, academicYear, semester, active`

## subjects/{id}
`code, name, type(subject|activity), colorCode, academicYear, semester, active`

## worksheets/{id}
ข้อมูลที่ User สามารถอ่านได้เมื่อ published + assigned เท่านั้น: `subjectId, subjectCode, subjectName, subjectColor, title, description, instructions, type, status, totalScore, opensAt, dueAt, targetClassroomIds, targetUserIds, allowLate, saveDraftEnabled, questions`.

**ห้ามเก็บ answer key ใน document นี้**.

## worksheetAnswerKeys/{worksheetId}
เฉลย/กติกาตรวจอัตโนมัติ. Admin-only read; server write.

## submissions/{submissionId}
`worksheetId, userId, status, answers, submittedAt, updatedAt` ไม่มีคะแนน/เกรด/rubric/comment.

## submissionGrades/{submissionId}
`totalScore, rubricScores, comment, status, gradedBy, gradedAt`. Admin-only.

## submissionOverrides/{id}
`worksheetId, userId, reason, validUntil, active, allowedBy, allowedAt`.
User อ่านของตนได้เฉพาะเพื่อแสดงสิทธิ์ แต่ UI ควรไม่เปิดเผยเหตุผล/ชื่อ Admin.

## auditLogs/{id}
`actorUid, actorRole, action, entityType, entityId, detail, createdAt`. Admin-only read, server-only write.
