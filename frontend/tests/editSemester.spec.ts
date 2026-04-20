import { test, expect } from '@playwright/test';

test('Edit Semester in Profile', async ({ page }) => {

  // 🔹 Go to login
  await page.goto('http://localhost:5173/login?role=student');

  // 🔹 Login
  await page.fill('input[type="email"]', process.env.TEST_EMAIL!);
  await page.fill('input[type="password"]', process.env.TEST_PASSWORD!);
  await page.click('button:has-text("Login")');

  // 🔹 Wait until dashboard loads (NOT profile)
  await page.waitForLoadState('networkidle');

  // 🔹 Open profile dropdown (HEADER)
  await page.click('[data-testid="profile-button"]');

  // 🔹 Click Profile option
  await page.click('text=Profile');

  // 🔹 Now wait for profile page
  await page.waitForURL('**/profile');

  // 🔹 Click Edit Profile
  await page.click('button:has-text("Edit Profile")');

  // 🔹 Change semester
  await page.selectOption('select[name="semester"]', { label: 'Semester 2' });

  // 🔹 Save changes
  await page.click('button:has-text("Save Changes")');

  // 🔹 Wait for update
  await page.waitForTimeout(2000);

  // 🔹 Verify updated value
  await expect(page.locator('text=Semester 2')).toBeVisible();

});