import { useEffect,useState } from 'react';
import { collection,getDocs,query,where,type DocumentData } from 'firebase/firestore';
import { db,demoMode } from '../lib/firebase';
import { subjects as demoSubjects,worksheets as demoWorksheets } from '../data/mock';
import type { AppUser,Subject,Worksheet } from '../types';

function mapDoc<T>(d: {id:string;data:()=>DocumentData}):T{return {id:d.id,...d.data()} as T}

export function useSubjects(){
  const [data,setData]=useState<Subject[]>(demoMode?demoSubjects:[]); const [loading,setLoading]=useState(!demoMode); const [error,setError]=useState('');
  useEffect(()=>{if(demoMode||!db)return;let alive=true;(async()=>{try{const s=await getDocs(collection(db,'subjects'));if(alive)setData(s.docs.map(d=>mapDoc<Subject>(d)).sort((a,b)=>a.code.localeCompare(b.code)));}catch(e){if(alive)setError(e instanceof Error?e.message:'โหลดรายวิชาไม่สำเร็จ')}finally{if(alive)setLoading(false)}})();return()=>{alive=false}},[]);
  return {data,loading,error};
}

export function useAdminWorksheets(){
  const [data,setData]=useState<Worksheet[]>(demoMode?demoWorksheets:[]); const [loading,setLoading]=useState(!demoMode); const [error,setError]=useState('');
  useEffect(()=>{if(demoMode||!db)return;let alive=true;(async()=>{try{const s=await getDocs(collection(db,'worksheets'));if(alive)setData(s.docs.map(d=>mapDoc<Worksheet>(d)));}catch(e){if(alive)setError(e instanceof Error?e.message:'โหลดใบงานไม่สำเร็จ')}finally{if(alive)setLoading(false)}})();return()=>{alive=false}},[]);
  return {data,loading,error};
}

export function useUserWorksheets(user:AppUser|null){
  const [data,setData]=useState<Worksheet[]>(demoMode?demoWorksheets:[]); const [loading,setLoading]=useState(!demoMode); const [error,setError]=useState('');
  useEffect(()=>{if(demoMode||!db||!user)return;let alive=true;(async()=>{try{
    const queries=[];
    queries.push(query(collection(db,'worksheets'),where('status','==','published'),where('targetUserIds','array-contains',user.uid)));
    if(user.classroomId)queries.push(query(collection(db,'worksheets'),where('status','==','published'),where('targetClassroomIds','array-contains',user.classroomId)));
    const snaps=await Promise.all(queries.map(q=>getDocs(q))); const m=new Map<string,Worksheet>(); snaps.forEach(s=>s.docs.forEach(d=>m.set(d.id,mapDoc<Worksheet>(d))));
    if(alive)setData([...m.values()].sort((a,b)=>(a.dueAt??'').localeCompare(b.dueAt??'')));
  }catch(e){if(alive)setError(e instanceof Error?e.message:'โหลดใบงานไม่สำเร็จ')}finally{if(alive)setLoading(false)}})();return()=>{alive=false}},[user?.uid,user?.classroomId]);
  return {data,loading,error};
}
