import { BarChart3,BookOpen,ClipboardCheck,Clock3,FileText,Plus,Users } from 'lucide-react';
import { SectionTitle } from '../../components/ui';
import { worksheets } from '../../data/mock';
import { Link } from 'react-router-dom';

export function AdminDashboard(){
  const k=[
    ['User ทั้งหมด','128',Users,'bg-blue-50 text-blue-700'],
    ['รายวิชา','13',BookOpen,'bg-cyan-50 text-cyan-700'],
    ['ใบงานเผยแพร่','8',FileText,'bg-indigo-50 text-indigo-700'],
    ['รอตรวจ','24',ClipboardCheck,'bg-purple-50 text-purple-700'],
    ['ยังไม่ส่ง','17',Clock3,'bg-orange-50 text-orange-700'],
    ['ส่งแล้ว','111',BarChart3,'bg-green-50 text-green-700']
  ] as const;
  return <div>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="page-title">ภาพรวมระบบ</h1><p className="muted mt-1">ติดตามใบงาน ผู้เรียน และสถานะการส่งงาน</p></div>
      <div className="flex gap-2"><Link to="/admin/worksheets/new" className="btn-primary"><Plus size={18}/>สร้างใบงาน</Link><Link to="/admin/users" className="btn-secondary"><Users size={18}/>เพิ่ม User</Link></div>
    </div>
    <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-6">
      {k.map(([a,b,I,c])=><div className="card" key={a}><div className={`grid h-9 w-9 place-items-center rounded-xl ${c}`}><I size={18}/></div><div className="mt-3 text-2xl font-bold">{b}</div><div className="text-xs text-slate-500">{a}</div></div>)}
    </div>
    <div className="mt-8 grid gap-5 xl:grid-cols-3">
      <div className="card xl:col-span-2">
        <SectionTitle title="สถานะการส่งงานรายวิชา" detail="ตัวอย่าง Dashboard สำหรับ Production"/>
        <div className="space-y-4">
          {['20001-1001','21900-1005','21910-2010','31901-2004'].map((s,i)=><div key={s}><div className="mb-1 flex justify-between text-sm"><b>{s}</b><span>{72+i*6}% ส่งแล้ว</span></div><div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{width:`${72+i*6}%`}}/></div></div>)}
        </div>
      </div>
      <div className="card">
        <SectionTitle title="รายการด่วน"/>
        <div className="space-y-3">{worksheets.slice(0,4).map(w=><div className="rounded-xl border border-slate-200 p-3" key={w.id}><div className="text-xs font-bold" style={{color:w.subjectColor}}>{w.subjectCode}</div><b className="text-sm">{w.title}</b><div className="mt-1 text-xs text-slate-500">กำหนดส่ง {w.dueAt?new Date(w.dueAt).toLocaleString('th-TH'):'-'}</div></div>)}</div>
      </div>
    </div>
  </div>;
}
