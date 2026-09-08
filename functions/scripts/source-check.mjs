import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),src=path.join(root,'src');
const required=['index.ts','shared/auth.ts','shared/firebase.ts','worksheets/index.ts','submissions/index.ts','grades/index.ts'];
for(const f of required)if(!fs.existsSync(path.join(src,f)))throw new Error('Missing '+f);
let n=0;const walk=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.ts')){n++;const s=fs.readFileSync(p,'utf8');if(s.includes('<<<<<<<')||s.includes('>>>>>>>'))throw new Error('Merge marker '+p)}}};walk(src);console.log(`Functions source check passed (${n} files)`);
