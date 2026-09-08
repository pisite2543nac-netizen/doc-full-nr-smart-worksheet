import { ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../lib/firebase';
export async function uploadSubmissionFile(uid:string,submissionId:string,file:File,onProgress:(p:number)=>void){
  if(!storage)throw new Error('Storage unavailable in Demo Mode');
  const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,'_');const path=`submission-files/${uid}/${submissionId}/${Date.now()}-${safe}`;const r=ref(storage,path);
  await new Promise<void>((resolve,reject)=>{const task=uploadBytesResumable(r,file,{contentType:file.type});task.on('state_changed',s=>onProgress(Math.round(s.bytesTransferred/s.totalBytes*100)),reject,()=>resolve());});
  return {path,name:file.name,size:file.size,type:file.type};
}
