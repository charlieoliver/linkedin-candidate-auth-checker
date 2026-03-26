const AI_WORDS = [
  "delve",
  "spearhead",
  "synergy",
  "transformative",
  "cutting-edge",
  "robust",
  "foster",
  "landscape",
  "unlock",
  "revolutionize"
];

export function analyzeNarrative(profile) {
  let score = 100;
  const positives = [];
  const risks = [];

  const text = (profile.resumeText || "").toLowerCase();

  let aiHits = 0;

  AI_WORDS.forEach(word => {
    if (text.includes(word)) aiHits++;
  });

  if (aiHits > 4) {
    score -= 30;
    risks.push("High density of AI-generated language");
  }

  if (text.includes("200%") || text.includes("300%")) {
    risks.push("Suspicious performance metrics without context");
    score -= 10;
  }

  if (text.includes("constraints") || text.includes("trade-offs")) {
    positives.push("Evidence of real-world project constraints");
  }

  return { score: Math.max(score, 0), positives, risks };
}
