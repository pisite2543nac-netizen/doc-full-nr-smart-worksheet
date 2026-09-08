export type Role='admin'|'user';
export type WorksheetType='digital'|'paper';
export type WorksheetStatus='draft'|'published'|'archived'|'closed';
export type SubmissionStatus='draft'|'submitted'|'late'|'pending_review'|'reviewed'|'expired';
export interface AppUser { uid:string; email:string; displayName:string; role:Role; isActive:boolean; studentId?:string; classroomId?:string; classroomName?:string; photoURL?:string; }
export interface Subject { id:string; code:string; name:string; type:'subject'|'activity'; colorCode:string; active:boolean; academicYear?:number; semester?:number; }
export interface Worksheet { id:string; subjectId:string; subjectCode:string; subjectName:string; subjectColor:string; title:string; description:string; instructions:string; type:WorksheetType; status:WorksheetStatus; totalScore?:number; opensAt?:string; dueAt?:string; targetClassroomIds:string[]; targetUserIds:string[]; allowLate:boolean; saveDraftEnabled:boolean; questions?:Question[]; }
export type QuestionType='singleChoice'|'multipleChoice'|'matching'|'shortAnswer'|'paragraph'|'codeEditor'|'fileUpload'|'drawingArea';
export interface Question { id:string; type:QuestionType; prompt:string; required:boolean; options?:string[]; maxLength?:number; pasteDisabled?:boolean; }
export interface Submission { id:string; worksheetId:string; userId:string; status:SubmissionStatus; submittedAt?:string; updatedAt?:string; answers?:Record<string,unknown>; }
