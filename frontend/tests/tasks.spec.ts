import { test, expect } from '@playwright/test';

test('Tasks Load Test', async ({ page }) => {
  await page.goto('http://localhost:5173/login?role=student');

  await page.fill('input[type="email"]',  process.env.TEST_EMAIL!);
  await page.fill('input[type="password"]',process.env.TEST_PASSWORD!);
  await page.click('button:has-text("Login as Student")');

  await page.waitForURL('**/dashboard');

  // Check dashboard loaded
  await expect(page.locator('text=Welcome Back')).toBeVisible();

  // Switch to list view
  await page.click('button:has-text("List View")');

  // Expect task table
  await expect(page.locator('table')).toBeVisible();
});