import { ArrowLeft,Check,Maximize2,Save,Send,WifiOff } from 'lucide-react';
import { useEffect,useMemo,useState } from 'react';
import { Link,useParams,useNavigate } from 'react-router-dom';
import { Countdown } from '../../components/Countdown';
import { QuestionRenderer } from '../../components/QuestionRenderer';
import { useAuth } from '../../context/AuthContext';
import { useUserWorksheets } from '../../hooks/useAppData';
import { callFunction } from '../../services/functions';
import { ErrorState,LoadingState } from '../../components/ui';

export function DoWorksheetPage(){
  const {id}=useParams(); const n=useNavigate(); const {user,demoMode}=useAuth(); const {data,loading,error}=useUserWorksheets(user);
  const w=data.find(x=>x.id===id); const qs=w?.questions??[]; const [answers,setAnswers]=useState<Record<string,unknown>>({}); const [sent,setSent]=useState(false); const [saveState,setSaveState]=useState<'idle'|'saving'|'saved'|'error'>('idle'); const [online,setOnline]=useState(navigator.onLine); const [busy,setBusy]=useState(false);
  const answered=useMemo(()=>Object.values(answers).filter(v=>Array.isArray(v)?v.length>0:String(v??'').length>0).length,[answers]);
  useEffect(()=>{const on=()=>setOnline(true),off=()=>setOnline(false);window.addEventListener('online',on);window.addEventListener('offline',off);return()=>{window.removeEventListener('online',on);window.removeEventListener('offline',off)}},[]);
  async function saveDraft(){if(!w||!w.saveDraftEnabled)return;setSaveState('saving');try{if(!demoMode)await callFunction('saveWorksheetDraft',{worksheetId:w.id,answers});setSaveState('saved')}catch{setSaveState('error')}}
  useEffect(()=>{if(!w?.saveDraftEnabled||sent)return;const t=setInterval(()=>{if(online)void saveDraft()},20000);return()=>clearInterval(t)},[w?.id,w?.saveDraftEnabled,answers,online,sent]);
  async function submit(){if(!w)return;const missing=qs.filter(q=>q.required&&(answers[q.id]===undefined||answers[q.id]===''||(Array.isArray(answers[q.id])&&(answers[q.id] as unknown[]).length===0)));if(missing.length){alert(`กรุณาตอบคำถามที่บังคับให้ครบ: ${missing.map((q,i)=>`ข้อ ${qs.indexOf(q)+1}`).join(', ')}`);return;}if(!confirm('ยืนยันการส่งใบงาน? หลังส่งแล้วอาจไม่สามารถแก้ไขได้'))return;setBusy(true);try{if(!demoMode)await callFunction('submitDigitalWorksheet',{worksheetId:w.id,answers});setSent(true)}catch(e){alert(e instanceof Error?e.message:'ส่งใบงานไม่สำเร็จ')}finally{setBusy(false)}}
  async function fullscreen(){try{await document.documentElement.requestFullscreen()}catch{}}
  if(loading)return <LoadingState/>;if(error)return <ErrorState message={error}/>;if(!w)return <ErrorState message="ไม่พบใบงานหรือคุณไม่มีสิทธิ์เข้าถึง"/>;
  if(sent)return <div className="mx-auto max-w-xl py-16 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-700"><Check size={32}/></div><h1 className="mt-4 text-2xl font-bold">ส่งใบงานเรียบร้อยแล้ว</h1><p className="muted mt-2">วันและเวลาส่งจริงได้รับการยืนยันจาก Server</p><button className="btn-primary mt-6" onClick={()=>n('/user/worksheets')}>กลับไปใบงานของฉัน</button></div>;
  return <div className="mx-auto max-w-5xl">
    {!online&&<div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><WifiOff size={17}/>การเชื่อมต่อขาดหาย ระบบจะไม่แสดงว่าบันทึกสำเร็จจนกว่า Server จะยืนยัน</div>}
    <div className="sticky top-16 z-20 -mx-4 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:mx-0 md:rounded-xl md:border"><div className="flex flex-wrap items-center justify-between gap-3"><div><Link to={`/user/worksheets/${w.id}`} className="inline-flex items-center gap-1 text-sm text-slate-500"><ArrowLeft size={15}/>ออกจากใบงาน</Link><div className="font-bold">{w.title}</div><div className="text-xs text-slate-500">{saveState==='saving'?'กำลังบันทึก...':saveState==='saved'?'บันทึกแล้ว':saveState==='error'?'บันทึกไม่สำเร็จ':'ยังไม่มีการบันทึกล่าสุด'}</div></div><div className="flex flex-wrap items-center gap-2"><Countdown dueAt={w.dueAt}/><button className="btn-secondary" onClick={fullscreen}><Maximize2 size={16}/>เต็มหน้าจอ</button><button className="btn-secondary" disabled={!w.saveDraftEnabled||busy} onClick={()=>void saveDraft()}><Save size={16}/>บันทึกร่าง</button></div></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-blue-600 transition-all" style={{width:`${qs.length?answered/qs.length*100:0}%`}}/></div><div className="mt-1 text-right text-xs text-slate-500">ตอบแล้ว {answered} จาก {qs.length} ข้อ</div></div>
    <div className="mt-5 space-y-4">{qs.map((q,i)=><QuestionRenderer key={q.id} question={q} index={i} value={answers[q.id]} onChange={v=>setAnswers(a=>({...a,[q.id]:v}))} worksheetId={w.id}/>)}</div>
    <div className="sticky bottom-0 mt-6 border-t border-slate-200 bg-slate-50/95 py-4 backdrop-blur"><button className="btn-primary w-full md:w-auto" disabled={busy||!online} onClick={()=>void submit()}><Send size={18}/>{busy?'กำลังส่ง...':'ส่งใบงาน'}</button></div>
  </div>
}
