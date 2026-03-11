import { detectSuspiciousEmail } from './utils/email-heuristics.js';

export async function scoreProfile(profile){
  let score = 0;
  const signals = [];

  if(profile.connections && profile.connections < 50){
    score += 10;
    signals.push('Low connection count');
  }

  if(!profile.github){
    score += 10;
    signals.push('No GitHub found');
  }

  if(profile.summary && profile.summary.length > 0){
    const phrases=["results-driven","passionate developer","proven track record"];
    const found=phrases.filter(p=>profile.summary.toLowerCase().includes(p));
    if(found.length>0){
      score+=20;
      signals.push('Template phrasing detected');
    }
  }

  if(profile.email){
    if(detectSuspiciousEmail(profile.email)){
      score+=10;
      signals.push('Suspicious email prefix');
    }
  }

  score=Math.min(100,score);

  return {
    score,
    signals
  };
}
