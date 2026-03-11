import { JSDOM } from "jsdom"
import { parseLinkedInProfile } from "../utils/linkedin-parser.js"

function assert(cond,msg){ if(!cond) throw new Error(msg) }

const html = `
<html>
<body>
<h1>Christopher Brown</h1>
<div class="pv-shared-text-with-see-more">
<span>Software engineer building distributed systems</span>
</div>
<span>120 connections</span>
<a href="https://github.com/chrisbrown">GitHub</a>
</body>
</html>
`

const dom = new JSDOM(html)
const doc = dom.window.document

const profile = parseLinkedInProfile(doc)

assert(profile.name === "Christopher Brown","name parsed")
assert(profile.summary.includes("Software engineer"),"summary parsed")
assert(profile.connections === 120,"connections parsed")
assert(profile.github.includes("github.com"),"github parsed")

console.log("parser test passed")
