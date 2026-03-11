import { parseLinkedInProfile } from './utils/linkedin-parser.js';
import { fetchJoinedDate } from './utils/profile-age.js';
import { scoreProfile } from './scoring-engine.js';
import { renderOverlay } from './ui-overlay.js';

async function runAnalysis() {
  const profile = parseLinkedInProfile(document);

  // Attempt to fetch profile join date from contact info overlay
  if (profile.contactInfoUrl) {
    try {
      const joinedDate = await fetchJoinedDate(profile.contactInfoUrl);
      if (joinedDate) profile.joinedDate = joinedDate;
    } catch {
      // Degrade gracefully — skip profile age signal
    }
  }

  const result = await scoreProfile(profile);
  renderOverlay(result);
}

setTimeout(runAnalysis, 2000);
