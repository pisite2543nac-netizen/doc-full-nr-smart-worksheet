import { onCall,HttpsError } from 'firebase-functions/v2/https';
import { db,FieldValue } from '../shared/firebase';
import { requireAdmin } from '../shared/auth';
import { audit } from '../shared/audit';
const region='asia-southeast1';

function splitWorksheetPayload(input:any){
  const data={...input};
  const totalScore=Number(data.totalScore??0);
  const answerKey=data.answerKey??data.answers??undefined;
  delete data.totalScore; delete data.answerKey; delete data.answers;
  delete data.score; delete data.rubricScores; delete data.comment; delete data.gradedBy; delete data.gradedAt;
  return {publicData:data,privateData:{totalScore,answers:answerKey??{}}};
}

export const createWorksheet=onCall({region},async req=>{
  const a=await requireAdmin(req);const {publicData,privateData}=splitWorksheetPayload(req.data as any);
  if(!publicData.title||!publicData.subjectId)throw new HttpsError('invalid-argument','ข้อมูลใบงานไม่ครบ');
  const ref=db.collection('worksheets').doc();const batch=db.batch();
  batch.set(ref,{...publicData,status:'draft',createdBy:a.uid,createdAt:FieldValue.serverTimestamp(),updatedAt:FieldValue.serverTimestamp()});
  batch.set(db.doc(`worksheetAnswerKeys/${ref.id}`),{worksheetId:ref.id,...privateData,createdAt:FieldValue.serverTimestamp(),updatedAt:FieldValue.serverTimestamp()});
  await batch.commit();await audit(a,'CREATE_WORKSHEET','worksheet',ref.id);return {id:ref.id};
});

export const updateWorksheet=onCall({region},async req=>{
  const a=await requireAdmin(req);const {id,...rest}=req.data as any;if(!id)throw new HttpsError('invalid-argument','worksheet id required');
  const {publicData,privateData}=splitWorksheetPayload(rest);const batch=db.batch();
  batch.update(db.doc(`worksheets/${id}`),{...publicData,updatedAt:FieldValue.serverTimestamp()});
  batch.set(db.doc(`worksheetAnswerKeys/${id}`),{worksheetId:id,...privateData,updatedAt:FieldValue.serverTimestamp()},{merge:true});
  await batch.commit();await audit(a,'UPDATE_WORKSHEET','worksheet',id);return {ok:true};
});

export const publishWorksheet=onCall({region},async req=>{
  const a=await requireAdmin(req);const {id}=req.data as any;const ref=db.doc(`worksheets/${id}`),s=await ref.get();if(!s.exists)throw new HttpsError('not-found','ไม่พบใบงาน');const w=s.data()!;
  if(!w.opensAt||!w.dueAt||(!(w.targetClassroomIds?.length)&&!(w.targetUserIds?.length)))throw new HttpsError('failed-precondition','ต้องกำหนดกลุ่มเป้าหมาย วันเปิด และกำหนดส่ง');
  await ref.update({status:'published',publishedAt:FieldValue.serverTimestamp(),updatedAt:FieldValue.serverTimestamp()});await audit(a,'PUBLISH_WORKSHEET','worksheet',id);return {ok:true};
});
