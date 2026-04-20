import { test, expect } from '@playwright/test';

test('Post Question Flow', async ({ page }) => {
  // 🔹 Step 1: Login
  await page.goto('http://localhost:5173/login?role=student');

  await page.fill('input[type="email"]', process.env.TEST_EMAIL!);
  await page.fill('input[type="password"]', process.env.TEST_PASSWORD!);

  await page.click('button:has-text("Login as Student")');

  await page.waitForURL('**/dashboard');

  // 🔹 Step 2: Go to Forum
  await page.click('text=Forum');
  await page.waitForURL('**/forum');

  // 🔹 Step 3: Open Modal
  await page.click('[data-testid="open-question-modal"]');

  // 🔹 Step 4: Fill Form
  const title = `Test Question ${Date.now()}`;

  await page.fill('[data-testid="question-title"]', title);

  await page.fill(
    '[data-testid="question-description"]',
    'This is a valid test description with more than thirty characters.'
  );

  // 🔹 Step 5: Submit
  await page.click('[data-testid="submit-question"]');

  // 🔹 Step 6: Verify Question Appears
  await expect(page.locator(`text=${title}`)).toBeVisible();
});