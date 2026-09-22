# Daily Rhythm Phase 1 v16 patch

Baseline: v15 cumulative shell patch.

This is a PATCH, not a full package. Replace/add only the files contained in this zip and leave every other repository file untouched.

Changed files:
- public/index.html
- public/sw.js
- release.json
- README_PHASE1_V16.md

Phase 1 changes:
- Voice now stays on My Day; no separate voice-screen hop.
- Visible flow: Ready → Listening → Understanding → Review before saving → Done.
- Schedule mutations are transactional: nothing is saved until the user taps Done.
- Tapping the microphone or editing before Done cancels the pending commit but preserves the draft so the user can continue/correct it.
- Clarification paths roll back any provisional schedule mutation.
- “I heard” and “I’ll do” review appears before commit.
- Long voice results are visually clamped to a compact summary.
- Service-worker cache bumped for deployment refresh.

Validation performed:
- Inline JavaScript syntax checked with Node.js.
- HTML checked for duplicate IDs; none found.

Not claimed here:
- Real-device microphone behavior, deployed Worker integration, and iPhone PWA interaction still require device/deployment testing.
