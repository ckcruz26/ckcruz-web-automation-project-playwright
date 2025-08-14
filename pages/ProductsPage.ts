import { faker } from "@faker-js/faker";
import { Page, Locator, expect } from "@playwright/test";

export class ProductsPage {
  readonly Page;
  readonly productFiltersArr: Array<string> = [
    "za",
    "lohi",
    "hilo",
    "hilo",
    "az",
  ];
  readonly filterDropdownProduct: Locator;

  readonly productList: Locator;
  readonly minCount = 3;

  readonly cartButton: Locator;
  readonly checkOutButton: Locator;

  //form checkout
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly postalCodeField: Locator;
  readonly continueButton: Locator;

  readonly checkOutOverviewTxt : Locator;

  readonly finishButton: Locator;
  readonly messageCheckout: Locator;


  constructor(page: Page) {
    this.Page = page;

    this.filterDropdownProduct = page.locator(
      '[data-test="product-sort-container"]'
    );

    this.productList = page.locator(".inventory_list .inventory_item");
    this.cartButton = page.locator('[data-test="shopping-cart-link"]');
    this.checkOutButton = page.locator('[data-test="checkout"]');

    this.firstNameField = page.locator('[data-test="firstName"]');
    this.lastNameField = page.locator('[data-test="lastName"]');
    this.postalCodeField = page.locator('[data-test="postalCode"]');
    
    this.continueButton = page.locator('[data-test="continue"]');
    this.checkOutOverviewTxt = page.locator('[data-test="title"]')

    this.finishButton = page.locator('[data-test="finish"]');
    this.messageCheckout = page.locator('[data-test="complete-header"]');

  }

  async filterProductsBySelection() {
    for (const arrFilter of this.productFiltersArr) {
      await this.filterDropdownProduct.selectOption(arrFilter);

      await this.Page.waitForTimeout(2000);
    }
  }

  async addToCartProducts() {
    const productCount = await this.productList.count();

    for (let i = 0; i < Math.min(this.minCount, productCount); i++) {
      const item = this.productList.nth(i);

      /*for debugging purposes
        const name = await item.locator(".inventory_item_name").textContent();
        const desc = await item.locator(".inventory_item_desc").textContent();
         const price = await item.locator(".inventory_item_price").textContent();*/

      await item.locator("button.btn_inventory").click();
    }
  }

  async checkOutProducts() {
    await this.cartButton.click();
    await this.Page.waitForTimeout(2000);

    await this.Page.waitForURL("**/cart.html");

    await this.checkOutButton.click();

    // Fill in the checkout form
    await this.Page.waitForURL("**/checkout-step-one.html");
    await this.firstNameField.fill(faker.person.firstName());
    await this.lastNameField.fill(faker.person.lastName());
    await this.postalCodeField.fill(faker.location.zipCode());

    await this.continueButton.click();
    await this.Page.waitForURL("**/checkout-step-two.html");

    await this.checkOutOverviewTxt.waitFor({ state: "visible" });
    await expect(this.checkOutOverviewTxt).toHaveText("Checkout: Overview");
    
    await this.finishButton.click();

    await this.Page.waitForTimeout(2000);
  }

  async assertCartMessage(expectedMessage: string) {
    await expect(this.messageCheckout).toBeVisible();
    await expect(this.messageCheckout).toHaveText(expectedMessage);
    await this.Page.waitForTimeout(2000);
  }

  async removeProductsInProductsPage() {
    const productCount = await this.productList.count();

    for (let i = 0; i < Math.min(this.minCount, productCount); i++) {
      const item = this.productList.nth(i);

      await item.locator("button.btn_inventory").click();
      await this.Page.waitForTimeout(2000);
      await item.locator("button.btn_inventory").click();
    }
  }
}
