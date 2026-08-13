import { test, expect } from '@playwright/test'

test.describe('public site smoke', () => {
  test('home loads with official site name and 7 nav items', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('banner')).toContainText('대한예수교장로회 사랑하는교회')
    await expect(page.getByRole('navigation').getByRole('link', { name: '교회소개' })).toBeVisible()
    await expect(page.getByRole('navigation').getByRole('link', { name: '예배안내' })).toBeVisible()
    await expect(page.getByRole('contentinfo')).toContainText('협력기관')
    await expect(page.getByRole('contentinfo')).toContainText('남경기노회')
  })

  test('news list and detail flow', async ({ page }) => {
    await page.goto('/news')
    await expect(page.getByRole('heading', { name: '교회소식' })).toBeVisible()
    const firstCard = page.locator('a[href^="/news/"]').first()
    await expect(firstCard).toBeVisible()
    await firstCard.click()
    await expect(page.getByRole('link', { name: '목록으로' })).toBeVisible()
  })

  test('about tabs switch without route change', async ({ page }) => {
    await page.goto('/about')
    await expect(page).toHaveURL(/\/about$/)
    await page.getByRole('tab', { name: '담임목사소개' }).click()
    await expect(page).toHaveURL(/\/about$/)
  })
})
