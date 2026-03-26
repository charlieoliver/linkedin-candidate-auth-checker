export function analyzeFootprint(profile) {
  let score = 50;
  const positives = [];
  const risks = [];

  if (profile.github) {
    if (profile.github.accountAge > 2) {
      score += 20;
      positives.push("GitHub history older than 2 years");
    }

    if (profile.github.commitYears > 1) {
      score += 20;
      positives.push("Consistent GitHub commit history");
    }

    if (profile.github.repos < 3) {
      score -= 10;
      risks.push("Minimal repository history");
    }
  } else {
    risks.push("No verifiable GitHub presence");
  }

  if (profile.linkedinConnections > 200) {
    score += 10;
    positives.push("Established LinkedIn network");
  }

  if (profile.linkedinAge && profile.linkedinAge < 1) {
    score -= 20;
    risks.push("Recently created LinkedIn profile");
  }

  return {
    score: Math.max(Math.min(score, 100), 0),
    positives,
    risks
  };
}
