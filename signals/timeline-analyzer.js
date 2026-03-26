export function analyzeTimeline(profile) {
  let score = 100;
  const positives = [];
  const risks = [];

  const roles = profile.experience || [];

  for (let i = 0; i < roles.length - 1; i++) {
    const current = roles[i];
    const next = roles[i + 1];

    if (current.end > next.start) {
      score -= 30;
      risks.push("Overlapping employment detected");
    }

    const tenure = current.end - current.start;

    if (tenure < 0.25) {
      score -= 10;
      risks.push("Extremely short tenure (<3 months)");
    }
  }

  const totalYears = roles.reduce((sum, r) => sum + (r.end - r.start), 0);

  if (profile.claimedExperience && totalYears < profile.claimedExperience) {
    score -= 25;
    risks.push("Claimed experience exceeds timeline math");
  }

  if (score > 80) positives.push("Career timeline consistent");

  return { score: Math.max(score, 0), positives, risks };
}
