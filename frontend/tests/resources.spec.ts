import { test, expect } from '@playwright/test';

test('Upload Resource Test', async ({ page }) => {
  // Login first
  await page.goto('http://localhost:5173/login?role=student');

  await page.fill('input[type="email"]',  process.env.TEST_EMAIL!);
  await page.fill('input[type="password"]', process.env.TEST_PASSWORD!);
  await page.click('button:has-text("Login as Student")');

  await page.waitForURL('**/dashboard');

  // Go to resources
  await page.goto('http://localhost:5173/resources');

  // Open modal
  await page.click('button:has-text("Upload")');

  // Fill form
  await page.fill('input[placeholder="Enter resource title"]', 'Test Resource');
  await page.fill('input[placeholder*="Data Structures"]', 'IT');
  
  await page.selectOption('select', 'PDF');

  await page.fill('textarea', 'Test Description');
  await page.fill('input[placeholder*="notes"]', 'test,playwright');

  // Upload file
  await page.setInputFiles('input[type="file"]', 'tests/sample.pdf');

  // Submit
  await page.click('button:has-text("Upload Resource"), button:has-text("Edit Resource")');

  // Expect success toast
  await expect(page.locator('text=Resource uploaded successfully')).toBeVisible();
});