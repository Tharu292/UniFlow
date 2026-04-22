import { test, expect } from '@playwright/test';

test('Admin filters users by active status', async ({ page }) => {
  await page.goto('http://localhost:5173/login?role=admin');

  await page.fill('[data-testid="login-email"]', process.env.ADMIN_TEST_EMAIL!);
  await page.fill('[data-testid="login-password"]', process.env.ADMIN_TEST_PASSWORD!);
  await page.click('[data-testid="login-submit"]');

  await page.waitForURL('**/admin/dashboard');
  await expect(page.locator('[data-testid="admin-dashboard-page"]')).toBeVisible();

  await page.goto('http://localhost:5173/admin/users');
  await expect(page.locator('[data-testid="user-management-page"]')).toBeVisible();
  await expect(page.locator('[data-testid="user-management-title"]')).toBeVisible();

  await page.selectOption('[data-testid="user-status-filter"]', 'active');

  await page.waitForTimeout(1500);

  const noUsersRow = page.locator('[data-testid="no-users-row"]');

  if (await noUsersRow.isVisible().catch(() => false)) {
    await expect(noUsersRow).toContainText('No users found');
  } else {
    const rows = page.locator('[data-testid^="user-row-"]');
    const count = await rows.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i).locator('[data-testid="user-status-active"]')).toBeVisible();
    }
  }
});