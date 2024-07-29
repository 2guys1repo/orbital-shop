import { test, expect } from '@playwright/test';

test.use({ storageState: "playwright/.auth/user.json" })
test('Should not access order lists without middleman permission', async ({ page }) => {
  await page.goto('/orders');
  await expect(page).toHaveURL("/")
  await page.getByRole('button', { name: 'Welcome, eric' }).click();
  await expect(page.getByRole('menuitem', { name: 'Manage Orders' })).not.toBeVisible();
});

test.describe('Tests for middleman capabilities', () => {
  test.use({ storageState: "playwright/.auth/middleman.json" })
  test('Able to navigate to manage orders', async ({ page }) => {
    await page.goto("/")
    await page.getByRole('button', { name: 'Welcome, john' }).click();
    await expect(page.getByRole('menuitem', { name: 'Manage Orders' })).toBeVisible();
    await page.getByRole('menuitem', { name: 'Manage Orders' }).click();
    await expect(page).toHaveURL("/orders")
    await expect(page.getByRole('heading', { name: 'Order Management' })).toBeVisible();
  })
  test('Able to update order status', async ({ page }) => {
    await page.goto('/orders')
    await page.getByRole('row', { name: '#36 Marc Wei Lian 28/07/2024' }).locator('div').click();
    await page.getByRole('menuitem', { name: 'Shipped' }).click();
    await expect(page.getByRole('row', { name: '#36 Marc Wei Lian 28/07/2024' }).locator('div')).toBeVisible();
    await page.getByRole('row', { name: '#36 Marc Wei Lian 28/07/2024' }).locator('div').click();
    await page.getByRole('menuitem', { name: 'Rejected' }).click();
    await expect(page.getByText('Rejected')).toBeVisible();
    await page.getByText('Rejected').click();
    await page.getByRole('menuitem', { name: 'Pending' }).click();
    await expect(page.getByRole('row', { name: '#36 Marc Wei Lian 28/07/2024' }).locator('div')).toBeVisible();
  })
})