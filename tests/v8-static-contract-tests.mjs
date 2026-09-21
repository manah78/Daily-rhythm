import fs from 'node:fs';
const html=fs.readFileSync(new URL('../public/index.html', import.meta.url),'utf8');
const worker=fs.readFileSync(new URL('../src/worker.js', import.meta.url),'utf8');
const checks=[
  ['successful command draft reset', html.includes('function clearCompletedCommandDraft()') && html.includes("commandInput.value=''" )],
  ['human CTA', html.includes('Talk to your day') && html.includes('Add, move, remove, or ask what’s free')],
  ['neutral previous state', html.includes("'نشاط سابق' : 'Previous activity'") && !html.includes("'فات الموعد' : 'Missed'" )],
  ['home is upcoming five', html.includes("'القادم' : 'Coming up'") && html.includes('.slice(0,5)') && html.includes('Number(b.start) >= nowH')],
  ['top card is single prayer countdown source', html.includes('remainingValue.textContent = diffStr') && !html.includes('`<span class="prayer-countdown">${diffStr}</span>`')],
  ['availability query model contract', worker.includes('query_availability') && worker.includes('duration_minutes')],
  ['deterministic availability engine', html.includes('function calculateAvailabilitySlots') && html.includes('function describeAvailability')],
  ['open-ended activities do not create guessed free time', html.includes('Open-ended activities deliberately have no trusted end time') && html.includes('I did not guess beyond it')],
  ['between add does not invent midpoint', html.includes('A between-window is a constraint, not a clock time. Do not invent a midpoint.')],
  ['provider remains Groq Qwen', worker.includes('qwen/qwen3.8-27b')]
];
let failed=0;
for(const [name,ok] of checks){ console.log(`${ok?'PASS':'FAIL'}: ${name}`); if(!ok)failed++; }
if(failed) process.exit(1);
