const SUSPICIOUS_TOKENS = [
  'dev', 'coder', 'engineer', 'pro', 'eng',
  'programmer', 'coding', 'techie', 'hacker'
];

export function detectSuspiciousEmail(email) {
  if (!email || !email.includes('@')) return { prefixMatch: false, postfixMatch: false };

  const localPart = email.split('@')[0].toLowerCase();
  const segments = localPart.split(/[._\-]/);

  const prefixMatch = SUSPICIOUS_TOKENS.some(t => localPart.startsWith(t));
  const postfixMatch = !prefixMatch && segments.length > 1 &&
    SUSPICIOUS_TOKENS.some(t => segments.slice(1).some(seg => seg === t));

  return { prefixMatch, postfixMatch };
}
