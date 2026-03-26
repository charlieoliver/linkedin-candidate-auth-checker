export function analyzeCompanyHistory(profile) {
  let score = 100;
  const positives = [];
  const risks = [];

  const roles = profile.experience || [];

  roles.forEach(role => {
    if (role.companyDomainAge !== undefined) {
      if (role.companyDomainAge < 1) {
        score -= 20;
        risks.push(`Company domain for ${role.company} appears very new`);
      } else if (role.companyDomainAge > 5) {
        positives.push(`${role.company} appears to have an established domain history`);
      }
    }

    if (role.companyLinkedInPresence === false) {
      score -= 20;
      risks.push(`Company ${role.company} lacks LinkedIn presence`);
    }
  });

  return {
    score: Math.max(score, 0),
    positives,
    risks
  };
}
