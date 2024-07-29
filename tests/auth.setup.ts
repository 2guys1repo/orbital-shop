import { test as setup, expect } from "@playwright/test";

const middlemanFile = "playwright/.auth/middleman.json";
const userFile = "playwright/.auth/user.json";

// Run this once to generate a middleman session to be reused
setup("authenticate as middleman", async ({ page }) => {
  await page.goto('/');
  // login as middleman
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByTestId('auth-email-field').click();
  await page.getByTestId('auth-email-field').fill(process.env.MIDDLEMAN_EMAIL!);
  await page.getByTestId('auth-submit-button').click();
  await page.getByLabel('Password', { exact: true }).fill(process.env.MIDDLEMAN_PW!);
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
  await page.context().storageState({ path: middlemanFile }); // save session to json file
})

// Run this once to generate a normal user session to be reused
setup("authenticate as normal user", async ({ page }) => {
  await page.goto('/');
  // login as normal user
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByTestId('auth-email-field').click();
  await page.getByTestId('auth-email-field').fill(process.env.USER_EMAIL!);
  await page.getByTestId('auth-submit-button').click();
  await page.getByLabel('Password', { exact: true }).fill(process.env.USER_PW!);
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
  await page.context().storageState({ path: userFile }); // save session to json file
})