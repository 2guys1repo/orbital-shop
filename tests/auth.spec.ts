// Contains tests for user authentication
import { test, expect } from '@playwright/test';
import crypto from 'node:crypto';

// test.use({ storageState: 'playwright/.auth/middleman.json' });

test.skip('able to login and logout', async ({ page }) => {
  await page.goto('/');
  // // login
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByTestId('auth-email-username-field').click();
  await page.getByTestId('auth-email-username-field').fill('john');
  await page.getByTestId('auth-submit-button').click();
  await page.getByLabel('Password', { exact: true }).fill('UW_wLV:8pQ5R-5z');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
  // logout
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
});

test.skip("able to register new account", async ({ page, browser }) => {
  test.slow();
  await page.goto('/');
  // register
  const randomHex = crypto.randomBytes(20).toString('hex');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByTestId('login-first-name-field').fill("testuser");
  await page.getByTestId('auth-last-name-field').fill(randomHex);
  await page.getByTestId('auth-email-username-field').fill(randomHex + "@mail7.io");
  await page.getByTestId('auth-submit-button').click();
  await expect(page.getByTestId('confirm-otp-title')).toBeVisible();

  // get verification code from mail7
  const mailPage = await browser.newPage(); // TODO might use mailinator api in future
  await mailPage.goto(`https://console.mail7.io/admin/inbox/inbox?username=${randomHex}`)
  const verificationMail = mailPage.getByText('orbitalshop / no-reply@kinde.');
  await verificationMail.waitFor()
  await verificationMail.click();
  const verificationCode = await mailPage.frameLocator('iframe').getByTestId('email-confirmation-code').textContent()
  if (typeof verificationCode != "string") throw new Error("no verification code");

  // fill in code
  await page.getByLabel('Code').fill(verificationCode.replace(/\t/g, ''));
  await page.getByTestId('otp-submit-button').click();
  await page.getByLabel('Password', { exact: true }).fill(randomHex);
  await page.getByLabel('Confirm password').fill(randomHex);
  await page.getByRole('button', { name: 'Continue' }).click() // App crashes after registration
})