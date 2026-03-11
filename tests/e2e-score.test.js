import { scoreProfile } from '../scoring-engine.js'

function assert(cond, msg) { if (!cond) throw new Error(msg) }

// Clean profile — should score 0
const cleanProfile = {
  name: 'Christopher Brown',
  summary: 'Software engineer building scalable platforms with expertise in cloud infrastructure',
  connections: 120,
  github: 'https://github.com/chrisbrown',
  email: 'cbrown@proton.me',
  hasProfilePhoto: true,
  joinedDate: 'January 2018'
}

const cleanResult = await scoreProfile(cleanProfile)
assert(typeof cleanResult.score === 'number', 'score returned')
assert(cleanResult.score >= 0 && cleanResult.score <= 100, 'score range valid')
assert(Array.isArray(cleanResult.signals), 'signals array exists')
assert(cleanResult.score === 0, `clean profile should score 0, got ${cleanResult.score}`)

// Suspicious profile — should score high
const susProfile = {
  name: 'Totally Real Person',
  summary: 'Results-driven passionate developer',
  connections: 8,
  github: null,
  email: 'devperson_coder@gmail.com',
  hasProfilePhoto: false
}

const susResult = await scoreProfile(susProfile)
assert(susResult.score >= 40, `suspicious profile should score high, got ${susResult.score}`)
assert(susResult.signals.length >= 3, `should have multiple signals, got ${susResult.signals.length}`)

console.log('e2e scoring test passed', { clean: cleanResult, suspicious: susResult })
