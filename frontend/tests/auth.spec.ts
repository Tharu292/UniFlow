import { test, expect } from '@playwright/test';

test('Student Login Test', async ({ page }) => {
  await page.goto('http://localhost:5173/login?role=student');

  await page.fill('input[type="email"]',process.env.TEST_EMAIL!);
  await page.fill('input[type="password"]',process.env.TEST_PASSWORD!);

  await page.click('button:has-text("Login as Student")');

  await page.waitForURL('**/dashboard');

  await expect(page.locator('text=Welcome Back')).toBeVisible();
});