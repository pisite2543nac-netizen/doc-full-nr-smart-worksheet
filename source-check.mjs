import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'src');
const required = [
  'main.tsx','App.tsx','lib/firebase.ts','context/AuthContext.tsx','styles/index.css',
  'pages/auth/LoginPage.tsx','pages/user/UserDashboard.tsx','pages/admin/AdminDashboard.tsx'
];
for (const rel of required) {
  const file = path.join(src, rel);
  if (!fs.existsSync(file)) throw new Error(`Missing required source: ${rel}`);
}
let count=0;
const walk=(dir)=>{for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(/\.(ts|tsx)$/.test(e.name)){count++;const s=fs.readFileSync(p,'utf8');if(s.includes('<<<<<<<')||s.includes('>>>>>>>')||s.includes('======='))throw new Error(`Merge marker found: ${p}`);}}};
walk(src);
if(count<20) throw new Error(`Unexpectedly few TS/TSX files: ${count}`);
console.log(`Source check passed (${count} TypeScript files)`);
