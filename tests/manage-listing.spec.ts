import { test, expect } from '@playwright/test';

test.describe("Able to perform CRUD on a product listing", () => {
  test.describe.configure({ mode: "serial" })
  test.use({ storageState: "playwright/.auth/middleman.json" })
  test("Able to list a product", async ({ page }) => {
    await page.goto("/sell")
    await page.getByPlaceholder('Enter listing title').fill('This is a test title');
    await page.getByPlaceholder('Include details for other').fill('This is a test description');
    await page.getByPlaceholder('0.00').fill('999');
    const imageLoc = page.locator("//html/body/div[1]/div/form/div/div[2]/div[4]/div/div/input")
    const imagePath = "playwright/images/bamboo-towel.jpg"
    await imageLoc.setInputFiles(imagePath)
    await expect(page.getByText('Uploading...')).toBeVisible()
    await expect(page.locator('div').filter({ hasText: /^bamboo-towel\.jpg 295 kB$/ })).toBeVisible({ timeout: 12000 });
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByAltText('This is a test title')).toBeVisible({ timeout: 10000 })
  })
  test('Able to edit a product listing', async ({ page }) => {
    await page.goto("/manage-listing")
    // navigates to the edit page
    await page.getByRole('row', { name: 'This is a test title $999' }).getByRole('link').click();
    await expect(page.getByRole('heading', { name: 'Edit your Listing' })).toBeVisible();
    // edit the listing fields
    await page.getByLabel('Listing title').fill('This is a test title edited');
    await page.getByLabel('Description').fill('This is a test description edited');
    await page.getByLabel('Price of your listing').fill('9999');
    // Upload new image
    const imageLoc = page.locator("//html/body/div[1]/div/form/div/div[2]/div[4]/div/div/input")
    const imagePath = "playwright/images/black.jpg"
    await imageLoc.setInputFiles(imagePath)
    await expect(page.getByText('Uploading...')).toBeVisible()
    await expect(page.locator('div').filter({ hasText: /^black\.jpg 713 B$/ })).toBeVisible({ timeout: 12000 });
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page).toHaveURL("/manage-listing")
    // Check that is updated
    await page.goto('/users/johndoe')
    await expect(page.getByRole('heading', { name: 'Listings' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '$9999' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'This is a test title edited', exact: true })).toBeVisible();
    await expect(page.getByAltText('This is a test title edited')).toBeVisible({ timeout: 10000 }) // checks the img
  });

  test('Able to delete a product listing successfully', async ({ page }) => {
    await page.goto("/manage-listing")
    await page.getByRole('row', { name: 'This is a test title edited' }).getByRole("button").click()
    await page.getByRole('button', { name: 'Yes, delete listing' }).click()
    await expect(page).toHaveURL("/")
  });
})