import { test, expect } from '@playwright/test';

test('Student adds a new task', async ({ page }) => {
  await page.goto('http://localhost:5173/login?role=student');

  await page.fill('input[type="email"]', process.env.TEST_EMAIL!);
  await page.fill('input[type="password"]', process.env.TEST_PASSWORD!);
  await page.click('button:has-text("Login as Student")');

  await page.waitForURL('**/dashboard');
  await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible();
  await expect(page.locator('[data-testid="dashboard-title"]')).toContainText('Welcome Back');

  await page.click('[data-testid="open-add-task-modal"]');
  await expect(page.locator('[data-testid="add-task-modal"]')).toBeVisible();

  const uniqueTitle = `Playwright Task ${Date.now()}`;

  const future = new Date();
  future.setDate(future.getDate() + 2);
  future.setHours(future.getHours() + 1);

  const yyyy = future.getFullYear();
  const mm = String(future.getMonth() + 1).padStart(2, '0');
  const dd = String(future.getDate()).padStart(2, '0');
  const hh = String(future.getHours()).padStart(2, '0');
  const min = String(future.getMinutes()).padStart(2, '0');
  const dueDateValue = `${yyyy}-${mm}-${dd}T${hh}:${min}`;

  await page.fill('[data-testid="task-title-input"]', uniqueTitle);
  await page.selectOption('[data-testid="task-type-select"]', 'assignment');
  await page.fill('[data-testid="task-due-date-input"]', dueDateValue);
  await page.selectOption('[data-testid="task-priority-select"]', 'high');
  await page.fill('[data-testid="task-module-input"]', 'IT3020');
  await page.fill('[data-testid="task-description-input"]', 'This task was created by Playwright automated testing.');
  await page.fill('[data-testid="task-resource-link-input"]', 'https://example.com/task-resource');

  await page.click('[data-testid="task-submit-button"]');

  await expect(page.locator('[data-testid="add-task-modal"]')).toBeHidden({ timeout: 10000 });

  await page.click('[data-testid="list-view-button"]');

  await expect(page.locator('[data-testid="tasks-table-body"]')).toContainText(uniqueTitle, { timeout: 10000 });
});