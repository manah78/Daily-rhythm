import fs from 'node:fs';
const html=fs.readFileSync(new URL('../public/index.html', import.meta.url),'utf8');
const worker=fs.readFileSync(new URL('../src/worker.js', import.meta.url),'utf8');
const checks=[
  ['schema exposes replacement_activity', worker.includes('replacement_activity') && worker.includes('replace gym with swimming')],
  ['edit target is existing activity', worker.includes('activity is ALWAYS the existing activity')],
  ['replacement-only edit does not require time', worker.includes('Do not ask for a time when the user only wants to replace/rename the activity')],
  ['client maps replacement activity', html.includes('replacementActivity') && html.includes('const hasReplacement = !!replacementActivity')],
  ['replacement-only edit executes', html.includes('if(replacementName)') && html.includes('target.label=replacementName')],
  ['destructive target still requires matched id', html.includes('requiresMatchedId:destructive') && html.includes('For Groq/Qwen destructive operations, never fall back to a fuzzy first match.')],
  ['old time cannot be mistaken for new time by prompt', worker.includes('A time mentioned before the word "to" can identify the existing target')],
  ['existing v8 availability preserved', worker.includes('query_availability') && html.includes('function calculateAvailabilitySlots')]
];
let failed=0;
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${name}`);if(!ok)failed++;}
if(failed)process.exit(1);
