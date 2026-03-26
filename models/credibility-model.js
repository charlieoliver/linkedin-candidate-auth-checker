import { analyzeTimeline } from "../signals/timeline-analyzer.js";
import { analyzeFootprint } from "../signals/footprint-analyzer.js";
import { analyzeNarrative } from "../signals/narrative-analyzer.js";
import { analyzeIdentity } from "../signals/identity-analyzer.js";
import { analyzeCompanyHistory } from "../signals/company-analyzer.js";
import { analyzeCrossPlatform } from "../signals/cross-platform-analyzer.js";

export function computeCredibility(profile) {
  const timeline = analyzeTimeline(profile);
  const footprint = analyzeFootprint(profile);
  const narrative = analyzeNarrative(profile);
  const identity = analyzeIdentity(profile);
  const company = analyzeCompanyHistory(profile);
  const cross = analyzeCrossPlatform(profile);

  const score =
    timeline.score * 0.25 +
    footprint.score * 0.20 +
    narrative.score * 0.15 +
    identity.score * 0.15 +
    company.score * 0.10 +
    cross.score * 0.15;

  return {
    credibilityScore: Math.round(score),
    signals: {
      positive: [
        ...timeline.positives,
        ...footprint.positives,
        ...narrative.positives,
        ...identity.positives,
        ...company.positives,
        ...cross.positives
      ],
      risks: [
        ...timeline.risks,
        ...footprint.risks,
        ...narrative.risks,
        ...identity.risks,
        ...company.risks,
        ...cross.risks
      ]
    }
  };
}
