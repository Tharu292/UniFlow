import { test, expect } from '@playwright/test';

test('Admin creates a notification', async ({ page }) => {
  await page.goto('http://localhost:5173/login?role=admin');

  await page.fill('[data-testid="login-email"]', process.env.ADMIN_TEST_EMAIL!);
  await page.fill('[data-testid="login-password"]', process.env.ADMIN_TEST_PASSWORD!);
  await page.click('[data-testid="login-submit"]');

  await page.waitForURL('**/admin/dashboard');
  await expect(page.locator('[data-testid="admin-dashboard-page"]')).toBeVisible();

  await page.goto('http://localhost:5173/admin/notifications');
  await expect(page.locator('[data-testid="notification-management-page"]')).toBeVisible();
  await expect(page.locator('[data-testid="notification-page-title"]')).toBeVisible();

  await page.click('[data-testid="create-notification-button"]');
  await expect(page.locator('[data-testid="notification-form-modal"]')).toBeVisible();

  const uniqueTitle = `Playwright Notification ${Date.now()}`;

  await page.fill('[data-testid="notification-title"]', uniqueTitle);
  await page.fill(
    '[data-testid="notification-message"]',
    'This is an automated notification created by Playwright for testing the admin notification flow.'
  );

  await page.selectOption('[data-testid="notification-priority"]', 'High');
  await page.selectOption('[data-testid="notification-target-audience"]', 'By Semester');
  await page.selectOption('[data-testid="notification-target-semester"]', 'Semester 1');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const dd = String(tomorrow.getDate()).padStart(2, '0');
  const expiryDate = `${yyyy}-${mm}-${dd}`;

  await page.fill('[data-testid="notification-expiry-date"]', expiryDate);

  await page.click('[data-testid="notification-submit-button"]');

  await expect(page.locator('[data-testid="notification-form-modal"]')).not.toBeVisible();

  await expect(page.locator(`text=${uniqueTitle}`)).toBeVisible({ timeout: 10000 });
});