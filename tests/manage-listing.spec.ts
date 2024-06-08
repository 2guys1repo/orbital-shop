import { test, expect } from '@playwright/test';

test.describe("Tests for managing listing", () => {
  test.describe.configure({ mode: "serial" })
  test.use({ storageState: "playwright/.auth/middleman.json" })
  test('should edit a product listing successfully', async ({ page }) => {
    await page.goto("/manage-listing")
    const newTitle = 'Updated Product Title';
    const newDescription = 'Updated product description.';
    const newPrice = '99';
    const newImagePath = 'path/to/updated-image.jpg';
    // opens the edit page
    await page.getByRole('row').locator("nth=-1").getByRole('button').first().click()
    // updates the listing details and save
    await page.getByLabel('Listing title').fill(newTitle);
    await page.getByLabel('Description').fill(newDescription);
    await page.getByLabel('Price of your listing').fill(newPrice);
    await page.getByRole('button', { name: 'Save' }).click();

    await page.getByRole('dialog').press('Escape');

    // displays the updated info
    await expect(page.getByRole('cell', { name: 'Updated Product Title' }).nth(-1)).toContainText(newTitle)
    await expect(page.getByRole('cell', { name: '$' }).nth(-1)).toContainText(`$${newPrice}`);
    // TODO need to update image
  });

  test('should delete a product listing successfully', async ({ page }) => {
    await page.goto("/manage-listing")
    await page.getByRole('row').locator("nth=-1").getByRole('button').nth(1).click()
    await page.getByRole('button', { name: 'Yes, delete listing' }).click()
    await expect(page).toHaveURL("/")
  });
})


