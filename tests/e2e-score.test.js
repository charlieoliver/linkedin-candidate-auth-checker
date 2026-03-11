import { scoreProfile } from '../scoring-engine.js'

function assert(cond,msg){ if(!cond) throw new Error(msg) }

const fakeProfile={
  name:'Christopher Brown',
  summary:'Software engineer building scalable platforms',
  connections:120,
  github:'https://github.com/chrisbrown',
  email:'cbrown@proton.me'
}

const result=await scoreProfile(fakeProfile)

assert(typeof result.score==='number','score returned')
assert(result.score>=0 && result.score<=100,'score range valid')
assert(Array.isArray(result.signals),'signals array exists')

console.log('e2e scoring test passed',result)
