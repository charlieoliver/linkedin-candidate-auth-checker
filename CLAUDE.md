# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chrome extension (Manifest V3) that analyzes LinkedIn profiles and produces a "Fake Candidate Risk Score" (0–100) based on heuristic signals. Local-first, GitHub API used optionally for enhanced detection. Early-stage MVP (v0.2.0).

## Commands

```bash
npm install              # Install dependencies
npm test                 # Runs tests/scoring-engine.test.js
npx playwright test      # Run Playwright integration tests
node tests/parser.test.js              # Run parser unit test directly
node tests/e2e-score.test.js           # Run end-to-end scoring test directly
node tests/email-heuristics.test.js    # Run email heuristics tests directly
```

## Architecture

ES modules (`"type": "module"` in package.json), vanilla JavaScript — no build step or bundler.

**Data flow:**

```
LinkedIn profile page
  → content-script.js (injected at document_idle, 2s delay)
    → utils/linkedin-parser.js (extracts name, summary, connections, GitHub URL, photo, contact link)
    → utils/profile-age.js (fetches contact overlay, extracts join date)
      → scoring-engine.js (calculates risk score 0–100 from 8 signal categories)
        → ui-overlay.js (renders color-coded results panel on page)
```

**Key modules:**
- `scoring-engine.js` — Core algorithm. Signals: low connections (+10), no GitHub (+5), GitHub account suspicious (+10), template phrasing (+8/+15 graduated), short/missing summary (+5), email prefix (+10), email postfix (+10), no profile photo (+15), profile age (+10/+15/+20 graduated). Max possible: 100. Returns `{ score, signals }`.
- `utils/linkedin-parser.js` — DOM scraper with fallback selector chains. Modern: `[data-view-name="profile-card-about"]`, legacy: `.pv-shared-text-with-see-more span`. Extracts: name, summary, connections, github, hasProfilePhoto, contactInfoUrl.
- `utils/email-heuristics.js` — Detects suspicious tokens in email local part. Returns `{ prefixMatch, postfixMatch }`. Tokens: dev, coder, engineer, pro, eng, programmer, coding, techie, hacker. Splits on `._-` separators for postfix detection.
- `utils/profile-age.js` — Fetches LinkedIn contact info overlay to extract "Joined" date. Graduated scoring: <3mo=+20, <6mo=+15, <12mo=+10.
- `services/github-check.js` — GitHub API user lookup. Returns repos, followers, created_at. Integrated into scoring with graceful degradation on network failure.
- `ui-overlay.js` — Fixed-position panel with color-coded score (green/yellow/orange/red). Uses DOM API (textContent) to prevent XSS.
- `background.js` — Minimal service worker (logs install event).

**Scoring table:**

| Signal | Points | Notes |
|--------|--------|-------|
| Email prefix | +10 | Starts with suspicious token |
| Email postfix | +10 | Contains suspicious token after separator |
| Profile age | +10/+15/+20 | Graduated: <12mo/+10, <6mo/+15, <3mo/+20 |
| No profile photo | +15 | SVG default avatar detected |
| Template phrasing | +8/+15 | 1 match=+8, 2+ matches=+15. 22 phrases |
| Low connections | +10 | <50 connections |
| No GitHub link | +5 | No github.com link on profile |
| GitHub suspicious | +10 | 0 repos (+3), 0 followers (+3), <6mo old (+4) |
| Short/missing summary | +5 | <30 chars or absent |
| **Max possible** | **100** | |

**Testing:** Custom assertion functions (no test framework). JSDOM for unit tests needing DOM. Playwright for integration tests against real HTML snapshots. Test fixtures in `tests/fixtures/` include sample LinkedIn profile HTML and real profile snapshots in `tests/fixtures/fakers/`.

## Extension Setup

Load as unpacked extension in Chrome from the project root. Runs automatically on `https://www.linkedin.com/in/*` pages.
