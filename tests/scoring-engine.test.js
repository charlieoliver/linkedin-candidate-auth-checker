import { scoreProfile } from '../scoring-engine.js';

function assert(cond, msg) {
  if (!cond) throw new Error('FAIL: ' + msg);
}

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  PASS: ${name}`);
  } catch (e) {
    failed++;
    console.log(`  FAIL: ${name} — ${e.message}`);
  }
}

console.log('scoring-engine tests');

// Low connections
await test('low connections adds 10 points', async () => {
  const r = await scoreProfile({ connections: 10 });
  assert(r.score >= 10, 'score should be >= 10');
  assert(r.signals.some(s => s.includes('Low connection')), 'signal missing');
});

await test('normal connections adds 0 points', async () => {
  const r = await scoreProfile({ connections: 200 });
  assert(!r.signals.some(s => s.includes('Low connection')), 'should not flag');
});

// No GitHub
await test('no github adds 5 points', async () => {
  const r = await scoreProfile({ connections: 200 });
  assert(r.signals.some(s => s.includes('No GitHub')), 'signal missing');
});

// Template phrasing — single match
await test('single template phrase adds 8 points', async () => {
  const r = await scoreProfile({
    connections: 200,
    github: 'https://github.com/someone',
    summary: 'I am a highly motivated engineer with deep experience in systems'
  });
  assert(r.signals.some(s => s === 'Template phrasing detected'), 'signal missing');
});

// Template phrasing — multiple matches
await test('multiple template phrases add 15 points', async () => {
  const r = await scoreProfile({
    connections: 200,
    github: 'https://github.com/someone',
    summary: 'I am a highly motivated team player with a proven track record'
  });
  assert(r.signals.some(s => s === 'Multiple template phrases detected'), 'signal missing');
});

// Short/missing summary
await test('short summary adds 5 points', async () => {
  const r = await scoreProfile({ connections: 200, github: 'https://github.com/x', summary: 'Hi' });
  assert(r.signals.some(s => s.includes('Short or missing')), 'signal missing');
});

await test('missing summary adds 5 points', async () => {
  const r = await scoreProfile({ connections: 200, github: 'https://github.com/x' });
  assert(r.signals.some(s => s.includes('Short or missing')), 'signal missing');
});

// Email prefix
await test('suspicious email prefix adds 10 points', async () => {
  const r = await scoreProfile({ connections: 200, github: 'https://github.com/x', summary: 'A long enough summary for the system to accept it', email: 'devjohn@gmail.com' });
  assert(r.signals.some(s => s.includes('Suspicious email prefix')), 'signal missing');
});

// Email postfix
await test('suspicious email postfix adds 10 points', async () => {
  const r = await scoreProfile({ connections: 200, github: 'https://github.com/x', summary: 'A long enough summary for the system to accept it', email: 'john_engineer@gmail.com' });
  assert(r.signals.some(s => s.includes('Suspicious email postfix')), 'signal missing');
});

// Clean email
await test('clean email adds 0 points', async () => {
  const r = await scoreProfile({ connections: 200, github: 'https://github.com/x', summary: 'A long enough summary for the system to accept it', email: 'john.smith@gmail.com' });
  assert(!r.signals.some(s => s.includes('email')), 'should not flag');
});

// No profile photo
await test('no profile photo adds 15 points', async () => {
  const r = await scoreProfile({ connections: 200, github: 'https://github.com/x', summary: 'A long enough summary for the system to accept it', hasProfilePhoto: false });
  assert(r.signals.some(s => s.includes('No profile photo')), 'signal missing');
});

await test('has profile photo adds 0 points', async () => {
  const r = await scoreProfile({ connections: 200, github: 'https://github.com/x', summary: 'A long enough summary for the system to accept it', hasProfilePhoto: true });
  assert(!r.signals.some(s => s.includes('photo')), 'should not flag');
});

// Profile age
await test('new profile (< 3 months) adds 20 points', async () => {
  const recent = new Date();
  recent.setMonth(recent.getMonth() - 1);
  const dateStr = recent.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const r = await scoreProfile({ connections: 200, github: 'https://github.com/x', summary: 'A long enough summary for the system to accept it', joinedDate: dateStr });
  assert(r.signals.some(s => s.includes('3 months')), 'signal missing');
});

await test('profile 4 months old adds 15 points', async () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 4);
  const dateStr = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const r = await scoreProfile({ connections: 200, github: 'https://github.com/x', summary: 'A long enough summary for the system to accept it', joinedDate: dateStr });
  assert(r.signals.some(s => s.includes('6 months')), 'signal missing');
});

await test('profile 8 months old adds 10 points', async () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 8);
  const dateStr = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const r = await scoreProfile({ connections: 200, github: 'https://github.com/x', summary: 'A long enough summary for the system to accept it', joinedDate: dateStr });
  assert(r.signals.some(s => s.includes('12 months')), 'signal missing');
});

await test('old profile adds 0 age points', async () => {
  const r = await scoreProfile({ connections: 200, github: 'https://github.com/x', summary: 'A long enough summary for the system to accept it', joinedDate: 'January 2020' });
  assert(!r.signals.some(s => s.includes('months ago')), 'should not flag');
});

// Max score capped at 100
await test('score capped at 100', async () => {
  const recent = new Date();
  recent.setMonth(recent.getMonth() - 1);
  const dateStr = recent.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const r = await scoreProfile({
    connections: 5,
    summary: 'I am a results-driven passionate developer with proven track record and highly motivated team player',
    github: null,
    email: 'devjohn_coder@gmail.com',
    hasProfilePhoto: false,
    joinedDate: dateStr
  });
  assert(r.score <= 100, `score ${r.score} exceeds 100`);
});

// Clean profile — minimal signals
await test('clean profile has low score', async () => {
  const r = await scoreProfile({
    connections: 500,
    summary: 'Principal engineer at Google with expertise in distributed systems and machine learning',
    github: 'https://github.com/nonexistent-user-test-00000',
    email: 'jane.smith@google.com',
    hasProfilePhoto: true,
    joinedDate: 'March 2015'
  });
  assert(r.score === 0, `expected 0 but got ${r.score}, signals: ${r.signals.join(', ')}`);
  assert(r.signals.length === 0, `expected no signals but got: ${r.signals.join(', ')}`);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
