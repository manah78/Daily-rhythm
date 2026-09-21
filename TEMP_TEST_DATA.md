# Temporary request/outcome capture

This testing build stores each submitted schedule request and its outcome locally on the device in localStorage (`dailyRhythmTemporaryRequestOutcomes_v1`). Nothing is uploaded automatically.

Captured data includes: original request text, language, interpreter path, AI plan when available, requested operations, result message, schedule before/after, and actual added/removed/changed activities.

To share the data for analysis: Settings → Temporary test data → Export test data. This downloads a JSON file. Upload that JSON to ChatGPT for review. Use Clear test data when the test session is finished.
