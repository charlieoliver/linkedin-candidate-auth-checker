import { computeCredibility } from "../models/credibility-model.js";

const mockProfile = {
  claimedExperience: 6,
  experience: [
    { start: 2018, end: 2020 },
    { start: 2020, end: 2024 }
  ],
  github: {
    accountAge: 4,
    commitYears: 3,
    repos: 10
  },
  linkedinConnections: 500,
  linkedinAge: 5,
  resumeText: "Built backend systems and handled scaling constraints"
};

const result = computeCredibility(mockProfile);

console.log("Credibility result:", result);

if (!result.credibilityScore) {
  throw new Error("Credibility score failed");
}
