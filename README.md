# LinkedIn Candidate Authenticity Checker

Chrome extension that analyzes LinkedIn profiles and produces a "Fake Candidate Risk Score" based on heuristic signals.

## Ethics, Privacy, and Human Review

This extension is decision-support only. It should surface profile signals for a human reviewer, not make or automate hiring decisions.

Usage boundaries:

- Do not use the score as the sole basis for rejection, ranking, or outreach decisions.
- Validate any concern against the candidate's submitted materials and interview evidence.
- Do not infer or process protected-class traits.
- Avoid collecting more profile data than is necessary for the immediate review.
- Keep analysis local by default; do not send profile data to external services without policy approval and a clear retention policy.
- Make the tool's limitations visible to reviewers so heuristic false positives are expected and checked.

Limitations:

- Sparse LinkedIn profiles can be legitimate.
- Low connection counts, career gaps, missing GitHub links, or generic summaries are weak signals on their own.
- Public-profile parsing is brittle and may break when LinkedIn changes markup.
- This tool should help focus human review, not label a person as fraudulent.

## MVP Goals
- Local-first analysis
- No external APIs required
- Heuristic scoring engine

## Features
- LinkedIn profile parsing
- Risk scoring (0–100)
- Signal breakdown
- UI overlay on profile pages

## Dev
Load unpacked extension from this folder in Chrome.

Run tests:

npm install
npm test
