import { test, expect } from '@playwright/test';

test.describe('Tests for product purchase process', () => {
  test.use({ storageState: "playwright/.auth/user.json" })
  test('Able to purchase a product', async ({ page }) => {
    await page.goto("/buy/4")
    await page.frameLocator('iframe[name^="__privateStripeFrame"]').first().getByPlaceholder('MM / YY').fill('444')
    await page.frameLocator('iframe[name^="__privateStripeFrame"]').first().getByPlaceholder('1234 1234 1234').fill('4242 4242 4242 4242')
    await page.frameLocator('iframe[name^="__privateStripeFrame"]').first().getByPlaceholder('CVC').fill('4444')
    await page.getByRole('button', { name: 'Checkout' }).click()
    await expect(page.getByRole('heading', { name: 'Order Received!' })).toBeVisible();
    await page.getByRole('link', { name: 'View My Orders' }).click();
  })
  test('Displays error messages for invalid card details', async ({ page }) => {
    await page.goto("/buy/4")
    await page.frameLocator('iframe[name^="__privateStripeFrame"]').first().getByPlaceholder('MM / YY').fill('1')
    await page.frameLocator('iframe[name^="__privateStripeFrame"]').first().getByPlaceholder('1234 1234 1234').fill('2')
    await page.frameLocator('iframe[name^="__privateStripeFrame"]').first().getByPlaceholder('CVC').fill('3')
    await page.getByRole('button', { name: 'Checkout' }).click()
    await expect(page.frameLocator('iframe[name^="__privateStripeFrame"]').first().getByText('Your card number is')).toBeVisible();
    await expect(page.frameLocator('iframe[name^="__privateStripeFrame"]').first().getByText('Your card\'s expiration date')).toBeVisible();
    await expect(page.frameLocator('iframe[name^="__privateStripeFrame"]').first().getByText('Your card\'s security code is')).toBeVisible();
  })
})
