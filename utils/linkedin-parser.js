function getText(el) {
  if (!el) return null;
  return el.innerText || el.textContent || null;
}

export function parseLinkedInProfile(doc) {
  const name = getText(doc.querySelector('h1'));

  // Summary: try modern selector first, fall back to legacy
  const summary =
    getText(doc.querySelector('[data-view-name="profile-card-about"] [data-testid="expandable-text-box"]')) ||
    getText(doc.querySelector('.pv-shared-text-with-see-more span')) ||
    null;

  // Connections: match with tighter regex
  const connectionsText = [...doc.querySelectorAll('span')]
    .map(e => getText(e))
    .find(t => t && /^\d+[\+,\s]*connections?$/i.test(t.trim()));

  let connections = null;
  if (connectionsText) {
    const num = parseInt(connectionsText.replace(/[,\s]/g, ''));
    if (!isNaN(num)) connections = num;
  }

  const github = [...doc.querySelectorAll('a')]
    .map(a => a.href)
    .find(h => h && h.includes('github.com'));

  // Profile photo detection
  const photoContainer = doc.querySelector('[data-view-name="profile-top-card-member-photo"]');
  let hasProfilePhoto = true; // default to true if we can't find the container
  if (photoContainer) {
    const img = photoContainer.querySelector('img[src]');
    const svg = photoContainer.querySelector('svg');
    if (svg && !img) {
      hasProfilePhoto = false;
    } else if (!img && !svg) {
      hasProfilePhoto = false;
    }
  }

  // Contact info overlay link (for profile age extraction by content script)
  const contactLink = [...doc.querySelectorAll('a')]
    .map(a => a.href)
    .find(h => h && h.includes('/overlay/contact-info/'));

  return {
    name,
    summary,
    connections,
    github,
    hasProfilePhoto,
    contactInfoUrl: contactLink || null
  };
}
