import { detectSuspiciousEmail } from '../utils/email-heuristics.js';

function assert(cond, msg) { if (!cond) throw new Error('FAIL: ' + msg); }

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  PASS: ${name}`);
  } catch (e) {
    failed++;
    console.log(`  FAIL: ${name} — ${e.message}`);
  }
}

console.log('email-heuristics tests');

// Prefix matches
test('detects "dev" prefix', () => {
  const r = detectSuspiciousEmail('devjohn@gmail.com');
  assert(r.prefixMatch === true, `got prefixMatch=${r.prefixMatch}`);
  assert(r.postfixMatch === false, `got postfixMatch=${r.postfixMatch}`);
});

test('detects "engineer" prefix', () => {
  const r = detectSuspiciousEmail('engineer.smith@gmail.com');
  assert(r.prefixMatch === true, `got prefixMatch=${r.prefixMatch}`);
});

test('detects "coder" prefix', () => {
  const r = detectSuspiciousEmail('coder42@hotmail.com');
  assert(r.prefixMatch === true, `got prefixMatch=${r.prefixMatch}`);
});

test('detects "programmer" prefix', () => {
  const r = detectSuspiciousEmail('programmer_jane@gmail.com');
  assert(r.prefixMatch === true, `got prefixMatch=${r.prefixMatch}`);
});

// Postfix matches (segment after separator)
test('detects "engineer" as postfix segment', () => {
  const r = detectSuspiciousEmail('john_engineer@gmail.com');
  assert(r.prefixMatch === false, `got prefixMatch=${r.prefixMatch}`);
  assert(r.postfixMatch === true, `got postfixMatch=${r.postfixMatch}`);
});

test('detects "dev" as postfix segment with dot separator', () => {
  const r = detectSuspiciousEmail('jane.dev@gmail.com');
  assert(r.postfixMatch === true, `got postfixMatch=${r.postfixMatch}`);
});

test('detects "hacker" as postfix segment with hyphen', () => {
  const r = detectSuspiciousEmail('bob-hacker@gmail.com');
  assert(r.postfixMatch === true, `got postfixMatch=${r.postfixMatch}`);
});

test('detects "techie" as postfix segment', () => {
  const r = detectSuspiciousEmail('sam_techie@outlook.com');
  assert(r.postfixMatch === true, `got postfixMatch=${r.postfixMatch}`);
});

// No match
test('normal email returns no match', () => {
  const r = detectSuspiciousEmail('john.smith@gmail.com');
  assert(r.prefixMatch === false, `got prefixMatch=${r.prefixMatch}`);
  assert(r.postfixMatch === false, `got postfixMatch=${r.postfixMatch}`);
});

test('email with numbers only returns no match', () => {
  const r = detectSuspiciousEmail('john42@gmail.com');
  assert(r.prefixMatch === false, `got prefixMatch=${r.prefixMatch}`);
  assert(r.postfixMatch === false, `got postfixMatch=${r.postfixMatch}`);
});

// Edge cases
test('null email returns no match', () => {
  const r = detectSuspiciousEmail(null);
  assert(r.prefixMatch === false, `got prefixMatch=${r.prefixMatch}`);
  assert(r.postfixMatch === false, `got postfixMatch=${r.postfixMatch}`);
});

test('email without @ returns no match', () => {
  const r = detectSuspiciousEmail('notanemail');
  assert(r.prefixMatch === false, `got prefixMatch=${r.prefixMatch}`);
  assert(r.postfixMatch === false, `got postfixMatch=${r.postfixMatch}`);
});

// Prefix takes priority over postfix when both could match
test('prefix match takes priority — no double-counting', () => {
  const r = detectSuspiciousEmail('dev_engineer@gmail.com');
  assert(r.prefixMatch === true, 'prefix should match');
  assert(r.postfixMatch === false, 'postfix should not also match');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
