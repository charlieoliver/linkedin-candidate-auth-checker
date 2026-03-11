import { detectSuspiciousEmail } from './utils/email-heuristics.js';
import { checkGithubProfile } from './services/github-check.js';
import { scoreProfileAge } from './utils/profile-age.js';

const TEMPLATE_PHRASES = [
  "results-driven", "passionate developer", "proven track record",
  "highly motivated", "team player", "detail-oriented",
  "self-starter", "fast learner", "think outside the box",
  "go-getter", "dynamic professional", "synergy",
  "leverage my skills", "seasoned professional", "innovative thinker",
  "thought leader", "guru", "ninja", "rockstar",
  "full stack wizard", "10x developer", "passionate about technology"
];

export async function scoreProfile(profile) {
  let score = 0;
  const signals = [];

  // Low connections: +10
  if (profile.connections !== null && profile.connections < 50) {
    score += 10;
    signals.push('Low connection count');
  }

  // No GitHub: +5 (reduced from 10)
  if (!profile.github) {
    score += 5;
    signals.push('No GitHub link found');
  }

  // GitHub account suspicious: up to +10
  if (profile.github) {
    try {
      const gh = await checkGithubProfile(profile.github);
      if (gh) {
        let ghScore = 0;
        const ghDetails = [];
        if (gh.repos === 0) { ghScore += 3; ghDetails.push('0 repos'); }
        if (gh.followers === 0) { ghScore += 3; ghDetails.push('0 followers'); }
        if (gh.created_at) {
          const created = new Date(gh.created_at);
          const monthsOld = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24 * 30);
          if (monthsOld < 6) { ghScore += 4; ghDetails.push('account < 6mo old'); }
        }
        if (ghScore > 0) {
          score += ghScore;
          signals.push(`GitHub account suspicious (${ghDetails.join(', ')})`);
        }
      }
    } catch {
      // Network error — degrade gracefully, skip GitHub signals
    }
  }

  // Template phrasing: graduated scoring — 1 match=+8, 2+=+15
  if (profile.summary && profile.summary.length > 0) {
    const lower = profile.summary.toLowerCase();
    const matchCount = TEMPLATE_PHRASES.filter(p => lower.includes(p)).length;
    if (matchCount >= 2) {
      score += 15;
      signals.push('Multiple template phrases detected');
    } else if (matchCount === 1) {
      score += 8;
      signals.push('Template phrasing detected');
    }
  }

  // Short/missing summary: +5
  if (!profile.summary || profile.summary.trim().length < 30) {
    score += 5;
    signals.push('Short or missing summary');
  }

  // Email prefix: +10
  if (profile.email) {
    const emailResult = detectSuspiciousEmail(profile.email);
    if (emailResult.prefixMatch) {
      score += 10;
      signals.push('Suspicious email prefix');
    }
    // Email postfix: +10
    if (emailResult.postfixMatch) {
      score += 10;
      signals.push('Suspicious email postfix');
    }
  }

  // No profile photo: +15
  if (profile.hasProfilePhoto === false) {
    score += 15;
    signals.push('No profile photo');
  }

  // Profile age: up to +20
  if (profile.joinedDate) {
    const ageResult = scoreProfileAge(profile.joinedDate);
    if (ageResult) {
      score += ageResult.score;
      signals.push(ageResult.label);
    }
  }

  score = Math.min(100, score);

  return { score, signals };
}
