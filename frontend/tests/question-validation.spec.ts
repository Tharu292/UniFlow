import { test, expect } from '@playwright/test';

test('Post Question Validation', async ({ page }) => {
  await page.goto('http://localhost:5173/login?role=student');

  await page.fill('input[type="email"]', process.env.TEST_EMAIL!);
  await page.fill('input[type="password"]', process.env.TEST_PASSWORD!);
  await page.click('button:has-text("Login as Student")');

  await page.waitForURL('**/dashboard');

  await page.click('text=Forum');
  await page.waitForURL('**/forum');

  await page.click('[data-testid="open-question-modal"]');

  //Invalid input
  await page.fill('[data-testid="question-title"]', '12345');
  await page.fill('[data-testid="question-description"]', 'short');

  await page.click('[data-testid="submit-question"]');

  //Expect validation errors
  await expect(page.locator('text=Minimum 30 characters required')).toBeVisible();
});