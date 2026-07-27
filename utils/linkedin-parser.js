function getText(el) {
  if (!el) return null;
  const text = el.innerText || el.textContent || null;
  return text && text.trim ? text.trim() : text;
}

function firstText(doc, selectors) {
  for (const sel of selectors) {
    const text = getText(doc.querySelector(sel));
    if (text) return text;
  }
  return null;
}

function findConnections(doc) {
  const texts = [...doc.querySelectorAll('span, li, div')]
    .map(e => getText(e))
    .filter(Boolean);

  const match = texts.find(t => /^\d+[+,\s]*connections?$/i.test(t.trim())) ||
    texts.find(t => /connections?/i.test(t));

  if (!match) return null;

  const num = parseInt(match.replace(/[^0-9]/g, ''), 10);
  if (Number.isNaN(num)) return null;

  return num;
}

function findGithub(doc) {
  const links = [...doc.querySelectorAll('a')]
    .map(a => a.href)
    .filter(Boolean);

  return links.find(h => /github\.com/i.test(h)) || null;
}

function parseExperience(doc) {
  const roles = [];
  const items = [...doc.querySelectorAll('section li, .pvs-list__paged-list-item')];

  for (const item of items) {
    const text = getText(item);
    if (!text) continue;

    const title = getText(item.querySelector('span[aria-hidden="true"]')) || null;
    const company = getText(item.querySelector('span.t-14.t-normal')) || null;
    const durationMatch = text.match(/\b(\d+\s+yr|\d+\s+mo)/i);
    const duration = durationMatch ? durationMatch[0] : null;

    if (title || company || duration) {
      roles.push({ title, company, duration });
    }

    if (roles.length > 10) break;
  }

  return roles;
}

function detectProfilePhoto(doc) {
  const photoContainer = doc.querySelector('[data-view-name="profile-top-card-member-photo"]');
  let hasProfilePhoto = true; // default true if LinkedIn markup omits the container

  if (photoContainer) {
    const img = photoContainer.querySelector('img[src]');
    const svg = photoContainer.querySelector('svg');
    if ((svg && !img) || (!img && !svg)) {
      hasProfilePhoto = false;
    }
  }

  return hasProfilePhoto;
}

function findContactInfoUrl(doc) {
  return [...doc.querySelectorAll('a')]
    .map(a => a.href)
    .find(h => h && h.includes('/overlay/contact-info/')) || null;
}

export function parseLinkedInProfile(doc) {
  const name = firstText(doc, [
    'h1',
    '.text-heading-xlarge',
    '.pv-top-card h1'
  ]);

  const headline = firstText(doc, [
    '.text-body-medium',
    '.pv-text-details__left-panel div.text-body-medium',
    '.top-card-layout__headline'
  ]);

  const location = firstText(doc, [
    '.text-body-small.inline.t-black--light.break-words',
    '.pv-text-details__left-panel span.text-body-small'
  ]);

  const summary = firstText(doc, [
    '[data-view-name="profile-card-about"] [data-testid="expandable-text-box"]',
    '.pv-shared-text-with-see-more span',
    '.display-flex.ph5.pv3 span',
    '#about ~ div span'
  ]);

  const connections = findConnections(doc);
  const github = findGithub(doc);
  const experience = parseExperience(doc);
  const hasProfilePhoto = detectProfilePhoto(doc);
  const contactInfoUrl = findContactInfoUrl(doc);

  return {
    name,
    headline,
    location,
    summary,
    connections,
    github,
    hasProfilePhoto,
    contactInfoUrl,
    experience
  };
}
