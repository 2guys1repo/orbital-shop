import { test as setup, expect } from "@playwright/test";

const middlemanFile = "playwright/.auth/middleman.json";

setup("authenticate as middleman", async ({ page }) => {
  await page.goto('/');
  // login as middleman
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByTestId('auth-email-username-field').click();
  await page.getByTestId('auth-email-username-field').fill(process.env.MIDDLEMAN_USER!);
  await page.getByTestId('auth-submit-button').click();
  await page.getByLabel('Password', { exact: true }).fill(process.env.MIDDLEMAN_PW!);
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
  await page.context().storageState({ path: middlemanFile });
})