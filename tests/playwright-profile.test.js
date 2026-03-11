import { test, expect } from '@playwright/test'
import fs from 'fs'

// This test loads a saved LinkedIn HTML snapshot
// and validates the parser against a real DOM structure

test('parse saved LinkedIn profile snapshot', async ({ page }) => {
  const html = fs.readFileSync('./tests/fixtures/sample-linkedin.html', 'utf8')

  await page.setContent(html)

  const profile = await page.evaluate(() => {
    const name = document.querySelector('h1')?.innerText || null

    const summary =
      document.querySelector('[data-view-name="profile-card-about"] [data-testid="expandable-text-box"]')?.innerText ||
      document.querySelector('.pv-shared-text-with-see-more span')?.innerText ||
      null

    const connectionsText = [...document.querySelectorAll('span')]
      .map(e => e.innerText)
      .find(t => t && /^\d+[\+,\s]*connections?$/i.test(t.trim()))

    let connections = null
    if (connectionsText) {
      const num = parseInt(connectionsText.replace(/[,\s]/g, ''))
      if (!isNaN(num)) connections = num
    }

    const github = [...document.querySelectorAll('a')]
      .map(a => a.href)
      .find(h => h && h.includes('github.com'))

    const photoContainer = document.querySelector('[data-view-name="profile-top-card-member-photo"]')
    let hasProfilePhoto = true
    if (photoContainer) {
      const img = photoContainer.querySelector('img[src]')
      const svg = photoContainer.querySelector('svg')
      if (svg && !img) hasProfilePhoto = false
      else if (!img && !svg) hasProfilePhoto = false
    }

    return { name, summary, connections, github, hasProfilePhoto }
  })

  expect(profile.name).not.toBeNull()
  expect(profile.connections).not.toBeNull()
  expect(profile.summary).not.toBeNull()
  expect(profile.hasProfilePhoto).toBe(true)
})
