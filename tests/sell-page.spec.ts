import { test, expect } from '@playwright/test';
import { SellPage } from '../playwright/pages/sell-page';

test('Should not access sell if not authenticated', async ({ page }) => {
  test.slow()
  await page.goto('/');
  await page.getByRole('link', { name: 'Sell' }).click();
  await expect(page.getByText('No account? Create one')).toBeVisible();
});

test.describe("Tests for listing a product", () => {
  test.use({ storageState: "playwright/.auth/middleman.json" })
  test("Able to list a product", async ({ page }) => {
    const sellPage = new SellPage(page);
    await sellPage.goto();
    await sellPage.fillFormDefault()
    await sellPage.submitForm();
    await sellPage.expectDefaultProductOnHomePage()
  })

  test("Able to show error message for client", async ({ page }) => {
    const sellPage = new SellPage(page);
    await sellPage.goto();
    await sellPage.fillFormDefault()
    // input < 5 char
    await sellPage.titleField.clear();
    await sellPage.descriptionField.clear();
    await sellPage.titleField.fill("123");
    await sellPage.descriptionField.fill("123");
    // await sellPage.imageField.setInputFiles([]); // TODO need to delete uploaded files
    await sellPage.submitForm()
    // expect client error message
    await expect(page.locator('div').filter({ hasText: /^Listing titleString must contain at least 5 character\(s\)$/ }).locator('div')).toBeVisible()
    await expect(page.locator('div').filter({ hasText: /^DescriptionString must contain at least 5 character\(s\)$/ }).locator('div')).toBeVisible()
  })
})