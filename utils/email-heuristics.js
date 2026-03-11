export function detectSuspiciousEmail(email){
  const prefixes=['dev','coder','engineer','pro','eng'];

  const name=email.split('@')[0].toLowerCase();

  return prefixes.some(p=>name.startsWith(p));
}
