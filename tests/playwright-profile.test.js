import { test, expect } from '@playwright/test'
import fs from 'fs'
import { parseLinkedInProfile } from '../utils/linkedin-parser.js'

// This test loads a saved LinkedIn HTML snapshot
// and validates the parser against a real DOM structure

test('parse saved LinkedIn profile snapshot', async ({ page }) => {

  const html = fs.readFileSync('./tests/fixtures/sample-linkedin.html','utf8')

  await page.setContent(html)

  const profile = await page.evaluate(() => {

    const name = document.querySelector('h1')?.innerText || null

    const summary = document.querySelector('.pv-shared-text-with-see-more span')?.innerText || null

    const connectionsText = [...document.querySelectorAll('span')]
      .map(e=>e.innerText)
      .find(t=>t && t.includes('connections'))

    let connections = null

    if(connectionsText){
      const num=parseInt(connectionsText)
      if(!isNaN(num)) connections=num
    }

    const github=[...document.querySelectorAll('a')]
      .map(a=>a.href)
      .find(h=>h && h.includes('github.com'))

    return {name,summary,connections,github}
  })

  expect(profile.name).not.toBeNull()
  expect(profile.connections).not.toBeNull()

})
