import fs from 'node:fs';
const cases = JSON.parse(fs.readFileSync(new URL('./arabic-dialect-regression.json', import.meta.url), 'utf8'));
const required = ['dialect','text','schedule','expected'];
let bad = 0;
for (const [i,c] of cases.entries()) {
  for (const k of required) if (!(k in c)) { console.error(`Case ${i+1} missing ${k}`); bad++; }
  if (!Array.isArray(c.expected) || !c.expected.length) { console.error(`Case ${i+1} has no expected operations`); bad++; }
}
const groups = new Map();
for (const c of cases) groups.set(c.dialect,(groups.get(c.dialect)||0)+1);
console.log(`Validated ${cases.length} regression fixtures across ${groups.size} language/dialect groups.`);
console.log([...groups].map(([k,v])=>`${k}: ${v}`).join('\n'));
if (bad) process.exit(1);

// Optional live smoke run. This deliberately does not pretend AI output is deterministic.
// Usage: TEST_BASE_URL=https://your-worker.example node tests/run-dialect-tests.mjs
const base = process.env.TEST_BASE_URL;
if (base) {
  let ok=0, failed=0;
  for (const c of cases) {
    if (c.expected[0].startsWith('clear-day:') || c.expected[0].startsWith('completion:')) continue; // handled client-side
    try {
      const r=await fetch(`${base.replace(/\/$/,'')}/api/interpret-command`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text:c.text,locale:'ar',schedule:c.schedule})});
      const j=await r.json();
      const shape = r.ok && j.intent==='operations' && Array.isArray(j.operations) && j.operations.length>0;
      if(shape) ok++; else { failed++; console.error('LIVE FAIL:',c.text,j); }
    } catch(e) { failed++; console.error('LIVE ERROR:',c.text,e.message); }
  }
  console.log(`Live endpoint structural smoke: ${ok} passed, ${failed} failed.`);
  if(failed) process.exit(2);
}
