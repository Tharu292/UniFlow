import { test, expect } from '@playwright/test';

test('Post Answer Flow', async ({ page }) => {
  // 🔹 Login
  await page.goto('http://localhost:5173/login?role=student');

  await page.fill('input[type="email"]', process.env.TEST_EMAIL!);
  await page.fill('input[type="password"]', process.env.TEST_PASSWORD!);
  await page.click('button:has-text("Login as Student")');

  await page.waitForURL('**/dashboard');

  // 🔹 Go to Forum
  await page.click('text=Forum');
  await page.waitForURL('**/forum');

  // 🔹 Open a question (first one)
  await page.locator('a[href*="/question/"]').first().click();

  await page.waitForURL('**/question/**');

  // 🔹 Create answer
  const answerText = `This is a valid answer with enough length ${Date.now()}`;

  await page.fill('[data-testid="answer-input"]', answerText);

  await page.click('[data-testid="submit-answer"]');

  // 🔹 Verify answer appears
  await expect(page.locator(`text=${answerText}`)).toBeVisible();
});