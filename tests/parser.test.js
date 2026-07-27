import { JSDOM } from "jsdom"
import { parseLinkedInProfile } from "../utils/linkedin-parser.js"

function assert(cond, msg) { if (!cond) throw new Error('FAIL: ' + msg) }

let passed = 0
let failed = 0

function test(name, fn) {
  try {
    fn()
    passed++
    console.log(`  PASS: ${name}`)
  } catch (e) {
    failed++
    console.log(`  FAIL: ${name} — ${e.message}`)
  }
}

console.log('parser tests')

// Modern selectors with photo, contact info, and experience
const modernHtml = `
<html><body>
<h1>Christopher Brown</h1>
<div data-view-name="profile-top-card-member-photo">
  <img src="https://media.licdn.com/photo.jpg" alt="Christopher Brown">
</div>
<div class="text-body-medium">Senior Backend Engineer</div>
<span class="text-body-small inline t-black--light break-words">Raleigh, NC</span>
<div data-view-name="profile-card-about">
  <div data-testid="expandable-text-box">Software engineer building distributed systems</div>
</div>
<span>120 connections</span>
<a href="https://github.com/chrisbrown">GitHub</a>
<a href="https://www.linkedin.com/in/chrisbrown/overlay/contact-info/">Contact</a>
<section>
  <li>
    <span aria-hidden="true">Backend Engineer</span>
    <span class="t-14 t-normal">ExampleCo</span>
    <span>2 yr</span>
  </li>
</section>
</body></html>
`

test('parses name from h1', () => {
  const doc = new JSDOM(modernHtml).window.document
  const profile = parseLinkedInProfile(doc)
  assert(profile.name === "Christopher Brown", `got: ${profile.name}`)
})

test('parses headline and location', () => {
  const doc = new JSDOM(modernHtml).window.document
  const profile = parseLinkedInProfile(doc)
  assert(profile.headline === "Senior Backend Engineer", `headline: ${profile.headline}`)
  assert(profile.location === "Raleigh, NC", `location: ${profile.location}`)
})

test('parses summary from modern selector', () => {
  const doc = new JSDOM(modernHtml).window.document
  const profile = parseLinkedInProfile(doc)
  assert(profile.summary.includes("Software engineer"), `got: ${profile.summary}`)
})

test('parses connections count', () => {
  const doc = new JSDOM(modernHtml).window.document
  const profile = parseLinkedInProfile(doc)
  assert(profile.connections === 120, `got: ${profile.connections}`)
})

test('parses github link', () => {
  const doc = new JSDOM(modernHtml).window.document
  const profile = parseLinkedInProfile(doc)
  assert(profile.github.includes("github.com"), `got: ${profile.github}`)
})

test('detects real profile photo', () => {
  const doc = new JSDOM(modernHtml).window.document
  const profile = parseLinkedInProfile(doc)
  assert(profile.hasProfilePhoto === true, `got: ${profile.hasProfilePhoto}`)
})

test('parses contact info URL', () => {
  const doc = new JSDOM(modernHtml).window.document
  const profile = parseLinkedInProfile(doc)
  assert(profile.contactInfoUrl && profile.contactInfoUrl.includes('/overlay/contact-info/'), `got: ${profile.contactInfoUrl}`)
})

test('parses experience roles', () => {
  const doc = new JSDOM(modernHtml).window.document
  const profile = parseLinkedInProfile(doc)
  assert(Array.isArray(profile.experience), 'experience array parsed')
  assert(profile.experience.length === 1, `roles: ${profile.experience.length}`)
  assert(profile.experience[0].title === "Backend Engineer", `title: ${profile.experience[0].title}`)
  assert(profile.experience[0].company === "ExampleCo", `company: ${profile.experience[0].company}`)
  assert(profile.experience[0].duration === "2 yr", `duration: ${profile.experience[0].duration}`)
})

// No photo (SVG avatar)
const noPhotoHtml = `
<html><body>
<h1>Fake Person</h1>
<div data-view-name="profile-top-card-member-photo">
  <svg id="person-icon"><circle cx="50" cy="50" r="40"/></svg>
</div>
<span>5 connections</span>
</body></html>
`

test('detects missing profile photo (SVG avatar)', () => {
  const doc = new JSDOM(noPhotoHtml).window.document
  const profile = parseLinkedInProfile(doc)
  assert(profile.hasProfilePhoto === false, `got: ${profile.hasProfilePhoto}`)
})

// Legacy selectors fallback
const legacyHtml = `
<html><body>
<h1>Legacy User</h1>
<div class="pv-shared-text-with-see-more">
  <span>Old-style summary text for the profile</span>
</div>
<span>300 connections</span>
</body></html>
`

test('falls back to legacy summary selector', () => {
  const doc = new JSDOM(legacyHtml).window.document
  const profile = parseLinkedInProfile(doc)
  assert(profile.summary.includes("Old-style summary"), `got: ${profile.summary}`)
})

// Connections with 500+ format
const plus500Html = `
<html><body>
<h1>Popular Person</h1>
<span>500+ connections</span>
</body></html>
`

test('parses 500+ connections', () => {
  const doc = new JSDOM(plus500Html).window.document
  const profile = parseLinkedInProfile(doc)
  assert(profile.connections === 500, `got: ${profile.connections}`)
})

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
