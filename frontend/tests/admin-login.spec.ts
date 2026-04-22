import { test, expect } from '@playwright/test';

test('Admin Login Test', async ({ page }) => {
  await page.goto('http://localhost:5173/login?role=admin');

  await page.fill('[data-testid="login-email"]', process.env.ADMIN_TEST_EMAIL!);
  await page.fill('[data-testid="login-password"]', process.env.ADMIN_TEST_PASSWORD!);
  await page.click('[data-testid="login-submit"]');

  await page.waitForURL('**/admin/dashboard');
  await expect(page.locator('[data-testid="admin-dashboard-page"]')).toBeVisible();
});