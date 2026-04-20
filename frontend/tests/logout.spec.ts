import { test, expect } from '@playwright/test';

test('User Logout via Header Dropdown', async ({ page }) => {

  await page.goto('http://localhost:5173/login?role=student');

  await page.fill('input[type="email"]', process.env.TEST_EMAIL!);
  await page.fill('input[type="password"]', process.env.TEST_PASSWORD!);
  await page.click('button:has-text("Login")');

  await page.waitForLoadState('networkidle');

  // ✅ Click profile icon (clean way)
  await page.click('[data-testid="profile-button"]');

  await page.click('text=Logout');

  await expect(page).toHaveURL(/login/);

});