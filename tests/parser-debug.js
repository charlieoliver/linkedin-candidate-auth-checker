import fs from 'fs';
import { JSDOM } from 'jsdom';
import { parseLinkedInProfile } from '../utils/linkedin-parser.js';

const file = process.argv[2];

if(!file){
  console.error('Usage: node tests/parser-debug.js <html-file>');
  process.exit(1);
}

const html = fs.readFileSync(file,'utf8');
const dom = new JSDOM(html);

const profile = parseLinkedInProfile(dom.window.document);

console.log('---- Parsed Profile ----');
console.log(JSON.stringify(profile,null,2));

console.log('\n---- Raw Signals ----');

const spans=[...dom.window.document.querySelectorAll('span')]
  .map(e=>e.textContent?.trim())
  .filter(Boolean)
  .slice(0,30);

console.log('Sample span text:');
console.log(spans);

const links=[...dom.window.document.querySelectorAll('a')]
  .map(a=>a.href)
  .filter(Boolean)
  .slice(0,20);

console.log('\nSample links:');
console.log(links);
