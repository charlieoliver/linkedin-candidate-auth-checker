export function analyzeIdentity(profile) {
  let score = 100;
  const positives = [];
  const risks = [];

  if (profile.linkedinAge !== undefined) {
    if (profile.linkedinAge < 1) {
      score -= 40;
      risks.push("LinkedIn account very new");
    } else if (profile.linkedinAge > 3) {
      positives.push("LinkedIn account age suggests established professional history");
    }
  }

  if (profile.linkedinConnections !== undefined) {
    if (profile.linkedinConnections < 50) {
      score -= 25;
      risks.push("Very low LinkedIn connection count");
    }

    if (profile.linkedinConnections > 200) {
      positives.push("Healthy professional network size");
    }
  }

  if (profile.hasProfilePhoto === false) {
    score -= 10;
    risks.push("Missing LinkedIn profile photo");
  }

  return {
    score: Math.max(score, 0),
    positives,
    risks
  };
}
