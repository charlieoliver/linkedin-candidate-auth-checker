/**
 * Parses a "Joined" date string from LinkedIn's contact info overlay
 * and returns a graduated risk score based on account age.
 *
 * @param {string|null} joinedDateStr - e.g. "January 2024" or "March 15, 2024"
 * @returns {{ score: number, label: string }|null}
 */
export function scoreProfileAge(joinedDateStr) {
  if (!joinedDateStr) return null;

  const joined = new Date(joinedDateStr);
  if (isNaN(joined.getTime())) return null;

  const now = new Date();
  const monthsOld = (now.getFullYear() - joined.getFullYear()) * 12 +
    (now.getMonth() - joined.getMonth());

  if (monthsOld < 3) return { score: 20, label: 'Profile created less than 3 months ago' };
  if (monthsOld < 6) return { score: 15, label: 'Profile created less than 6 months ago' };
  if (monthsOld < 12) return { score: 10, label: 'Profile created less than 12 months ago' };

  return null; // older than 12 months — no risk signal
}

/**
 * Fetches the LinkedIn contact info overlay and extracts the "Joined" date.
 *
 * @param {string} contactInfoUrl - Full URL to the contact info overlay
 * @returns {Promise<string|null>} - The joined date string, or null
 */
export async function fetchJoinedDate(contactInfoUrl) {
  try {
    const res = await fetch(contactInfoUrl);
    if (!res.ok) return null;

    const html = await res.text();
    // LinkedIn renders "Joined <month> <year>" in the contact overlay
    const match = html.match(/Joined\s+([\w\s,]+\d{4})/i);
    return match ? match[1].trim() : null;
  } catch {
    return null;
  }
}
