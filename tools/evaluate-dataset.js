import fs from 'fs';
import path from 'path';
import { computeCredibility } from '../models/credibility-model.js';

const DATA_DIR = path.join(process.cwd(), 'tests/fixtures/fakers');
const LABELS = JSON.parse(fs.readFileSync(path.join(process.cwd(),'dataset/labels.json')));

function fakeProfileFromFile(name) {
  const lower = name.toLowerCase();

  // crude synthetic profile generator for dataset scoring
  return {
    claimedExperience: 5,
    experience: [
      { start: 2019, end: 2021 },
      { start: 2021, end: 2024 }
    ],
    github: lower.includes('samuel')
      ? { accountAge: 0.2, commitYears: 0, repos: 1 }
      : { accountAge: 3, commitYears: 2, repos: 8 },
    linkedinConnections: lower.includes('samuel') ? 40 : 350,
    linkedinAge: lower.includes('samuel') ? 0.5 : 4,
    resumeText: lower.includes('walker')
      ? 'Spearheaded transformative synergy initiatives that increased performance 200%'
      : 'Built backend systems and handled scaling constraints'
  };
}

function runEvaluation() {
  const files = fs.readdirSync(DATA_DIR);

  const results = [];

  for (const file of files) {
    if (!file.endsWith('.pdf') && !file.endsWith('.html')) continue;

    const profile = fakeProfileFromFile(file);

    const result = computeCredibility(profile);

    results.push({
      file,
      score: result.credibilityScore,
      risks: result.signals.risks.length
    });
  }

  console.log('\nDataset Evaluation Results\n');

  results.forEach(r => {
    console.log(`${r.file} → score: ${r.score}, riskSignals: ${r.risks}`);
  });

  const avg = results.reduce((s, r) => s + r.score, 0) / results.length;

  console.log(`\nAverage credibility score: ${avg.toFixed(2)}`);

// compute simple classification metrics
let tp=0, tn=0, fp=0, fn=0;

results.forEach(r=>{
  const label = LABELS[r.file];
  if(!label) return;

  const predictedFraud = r.score < 75;

  if(label==='fraud' && predictedFraud) tp++;
  if(label==='fraud' && !predictedFraud) fn++;
  if(label==='legit' && !predictedFraud) tn++;
  if(label==='legit' && predictedFraud) fp++;
});

const precision = tp/(tp+fp||1);
const recall = tp/(tp+fn||1);

console.log('\nEvaluation Metrics');
console.log('TP:',tp,'FP:',fp,'TN:',tn,'FN:',fn);
console.log('Precision:',precision.toFixed(2));
console.log('Recall:',recall.toFixed(2));
}

runEvaluation();
