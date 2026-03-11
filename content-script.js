import { parseLinkedInProfile } from './utils/linkedin-parser.js';
import { scoreProfile } from './scoring-engine.js';
import { renderOverlay } from './ui-overlay.js';

async function runAnalysis(){
  const profile = parseLinkedInProfile(document);
  const result = await scoreProfile(profile);
  renderOverlay(result);
}

setTimeout(runAnalysis,2000);
