import { expect, type Locator, type Page } from '@playwright/test';

export class SellPage {
  readonly page: Page;
  readonly titleField: Locator;
  readonly descriptionField: Locator;
  readonly priceField: Locator;
  readonly imageField: Locator;
  readonly submitButton: Locator;
  readonly uploadButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleField = page.getByPlaceholder('Enter listing title')
    this.descriptionField = page.getByPlaceholder('Include details for other')
    this.priceField = page.getByPlaceholder('0.00')
    this.imageField = page.locator("//html/body/div[2]/form/div/div[2]/div[4]/label/div/div[1]/label/input")
    this.submitButton = page.getByRole('button', { name: 'Save' })
    this.uploadButton = page.getByRole('button', { name: 'Upload 1 file' })
  }

  async goto() {
    await this.page.goto('/sell');
  }


  async fillForm(title?: string, description?: string, price?: string, imagePath?: string) {
    await this.titleField.fill(title || "");
    await this.descriptionField.fill(description || "");
    await this.priceField.fill(price || "");
    await this.imageField.setInputFiles(imagePath || "");
  }

  async fillFormDefault() {
    const title = "UltraSoft Bamboo Fiber Towel"
    const description = "Experience the ultimate in comfort with our UltraSoft Bamboo Fiber Towel. Crafted from 100% natural bamboo fibers, this towel is incredibly soft, highly absorbent, and eco-friendly. Perfect for sensitive skin, it provides a gentle touch and luxurious feel after every shower. Available in various sizes and colors to match your bathroom decor."
    const price = "20"
    const imagePath = "playwright/images/bamboo-towel.jpg"

    await this.fillForm(title, description, price, imagePath)
    await this.uploadImage()
  }

  async uploadImage() {
    await this.uploadButton.click()
    await this.page.getByRole('link', { name: 'bamboo-towel.jpg 295 kB' }).waitFor()
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async expectDefaultProductOnHomePage() {
    await this.page.waitForURL("/", { waitUntil: "load" })
    await expect(this.page.getByRole('heading', { name: 'UltraSoft Bamboo Fiber Towel' }).first()).toBeVisible();
  }
}
