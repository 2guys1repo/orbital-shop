import { test, expect } from '@playwright/test';

test('Should not access sell if not authenticated', async ({ page }) => {
  test.slow()
  await page.goto('/');
  await page.getByRole('link', { name: 'Sell' }).click();
  await expect(page.getByText('No account? Create one')).toBeVisible();
});

test.describe("Listing form renders properly", () => {
  test.use({ storageState: "playwright/.auth/middleman.json" })
  test("display error messages for invalid inputs", async ({ page }) => {
    await page.goto("/sell")
    await page.getByPlaceholder('Enter listing title').fill('1');
    await page.getByPlaceholder('Include details for other').fill('1');
    await page.getByPlaceholder('0.00').fill('1');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('div').filter({ hasText: /^Listing titleString must contain at least 5 character\(s\)$/ }).locator('div')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^DescriptionString must contain at least 5 character\(s\)$/ }).locator('div')).toBeVisible();
    await expect(page.getByText('Image is required')).toBeVisible();
  })
})