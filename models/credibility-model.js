import { analyzeTimeline } from "../signals/timeline-analyzer.js";
import { analyzeFootprint } from "../signals/footprint-analyzer.js";
import { analyzeNarrative } from "../signals/narrative-analyzer.js";

export function computeCredibility(profile) {
  const timeline = analyzeTimeline(profile);
  const footprint = analyzeFootprint(profile);
  const narrative = analyzeNarrative(profile);

  const score =
    timeline.score * 0.4 +
    footprint.score * 0.35 +
    narrative.score * 0.25;

  return {
    credibilityScore: Math.round(score),
    signals: {
      positive: [...timeline.positives, ...footprint.positives, ...narrative.positives],
      risks: [...timeline.risks, ...footprint.risks, ...narrative.risks]
    }
  };
}
