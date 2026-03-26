export function analyzeCrossPlatform(profile) {
  let score = 100;
  const positives = [];
  const risks = [];

  if (profile.resumeCompanies && profile.linkedinCompanies) {
    const resumeSet = new Set(profile.resumeCompanies.map(c => c.toLowerCase()));
    const linkedinSet = new Set(profile.linkedinCompanies.map(c => c.toLowerCase()));

    const mismatches = [...resumeSet].filter(c => !linkedinSet.has(c));

    if (mismatches.length > 0) {
      score -= 40;
      risks.push(`Resume/LinkedIn company mismatch: ${mismatches.join(', ')}`);
    } else {
      positives.push("Resume and LinkedIn company history aligned");
    }
  }

  if (profile.github && profile.claimedEngineering && profile.github.commitYears === 0) {
    score -= 20;
    risks.push("Engineering claim with no GitHub activity history");
  }

  return {
    score: Math.max(score, 0),
    positives,
    risks
  };
}
