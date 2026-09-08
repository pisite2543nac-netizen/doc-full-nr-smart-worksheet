import fs from 'node:fs';
const required=['src/main.tsx','src/App.tsx','src/lib/firebase.ts','src/styles/index.css'];
for (const f of required) if(!fs.existsSync(new URL('../'+f, import.meta.url))) throw new Error('Missing '+f);
console.log('Web smoke test passed');
