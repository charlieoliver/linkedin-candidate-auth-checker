import { analyzeTimeline } from "../signals/timeline-analyzer.js";
import { analyzeFootprint } from "../signals/footprint-analyzer.js";
import { analyzeNarrative } from "../signals/narrative-analyzer.js";
import { analyzeIdentity } from "../signals/identity-analyzer.js";
import { analyzeCompanyHistory } from "../signals/company-analyzer.js";

export function computeCredibility(profile) {
  const timeline = analyzeTimeline(profile);
  const footprint = analyzeFootprint(profile);
  const narrative = analyzeNarrative(profile);
  const identity = analyzeIdentity(profile);
  const company = analyzeCompanyHistory(profile);

  const score =
    timeline.score * 0.30 +
    footprint.score * 0.25 +
    narrative.score * 0.20 +
    identity.score * 0.15 +
    company.score * 0.10;

  return {
    credibilityScore: Math.round(score),
    signals: {
      positive: [
        ...timeline.positives,
        ...footprint.positives,
        ...narrative.positives,
        ...identity.positives,
        ...company.positives
      ],
      risks: [
        ...timeline.risks,
        ...footprint.risks,
        ...narrative.risks,
        ...identity.risks,
        ...company.risks
      ]
    }
  };
}
