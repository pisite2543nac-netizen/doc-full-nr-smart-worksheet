import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const src = path.join(root, 'src');
const out = path.join(root, 'lib');
fs.rmSync(out,{recursive:true,force:true});
let count=0;
function walk(dir){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    const p=path.join(dir,e.name);
    if(e.isDirectory()) walk(p);
    else if(e.name.endsWith('.ts')){
      const rel=path.relative(src,p).replace(/\.ts$/,'.js');
      const dest=path.join(out,rel);
      fs.mkdirSync(path.dirname(dest),{recursive:true});
      const source=fs.readFileSync(p,'utf8');
      const r=ts.transpileModule(source,{fileName:p,reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true,sourceMap:false}});
      const errors=(r.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error);
      if(errors.length){
        for(const d of errors) console.error(ts.flattenDiagnosticMessageText(d.messageText,'\n'));
        throw new Error(`TypeScript syntax error in ${p}`);
      }
      fs.writeFileSync(dest,r.outputText,'utf8');count++;
    }
  }
}
walk(src);
if(!fs.existsSync(path.join(out,'index.js'))) throw new Error('functions/lib/index.js was not generated');
console.log(`Functions build passed (${count} files transpiled)`);
