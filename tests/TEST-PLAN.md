# Conversational Arabic test plan

The goal is not keyword recognition; it is reliable schedule intent extraction from natural Arabic.

## Gates
1. **Static gate** — `node tests/run-dialect-tests.mjs` validates every fixture and coverage group.
2. **Syntax gate** — `node --check` on Worker, service worker, external JS, and extracted inline scripts.
3. **Live AI structural gate** — after deploy, run with `TEST_BASE_URL=https://... node tests/run-dialect-tests.mjs`. Every non-client-only case must return a non-empty `operations[]` plan.
4. **Semantic acceptance gate** — manually compare the live returned operations against `expected` for all fixtures. AI output is semantic, so a structural pass alone is not enough.
5. **Mutation gate in the PWA** — seed a known schedule and run representative add/edit/delete/mixed cases. Verify actual schedule state, not just the message.
6. **Destructive safety gate** — vague phrases must not delete. Clear-day must require confirmation. Completion phrases must not become delete.
7. **Speech gate** — on iPhone, speak a subset rather than type it, covering Levantine, Egyptian, Gulf and code-switching; verify STT text and final operation separately.
8. **Offline/failure gate** — disable network/AI and verify deterministic commands still work; unsupported slang should fail safely rather than mutate incorrectly.

## Release target
Do not call dialect support ready from prompt changes alone. Treat it as ready only after live semantic + mutation tests pass, with zero destructive false positives in the safety set.
