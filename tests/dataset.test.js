import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { parseLinkedInProfile } from '../utils/linkedin-parser.js';
import { scoreCandidate } from '../scoring-engine.js';

const fixturesDir = path.resolve('./tests/fixtures/fakers');

function getHtmlFiles(){
  return fs.readdirSync(fixturesDir)
    .filter(f => f.endsWith('.html'))
    .map(f => path.join(fixturesDir, f));
}

function run(){
  const files = getHtmlFiles();

  console.log('Dataset evaluation');
  console.log('Profiles:', files.length);
  console.log('--------------------------------');

  for(const file of files){
    const html = fs.readFileSync(file, 'utf8');
    const dom = new JSDOM(html);

    const profile = parseLinkedInProfile(dom.window.document);
    const score = scoreCandidate(profile);

    console.log('\nProfile:', path.basename(file));
    console.log('name:', profile.name);
    console.log('connections:', profile.connections);
    console.log('github:', profile.github);
    console.log('score:', score);
  }
}

run();
