import path from "path";
import { test } from "../fixtures/FixtureHandler";


test.describe("Products Suite", () => {
  test.use({
    storageState: path.resolve(__dirname, "../auth/authentication.json"),
  });
  test.beforeEach(async ({ page }) => {
    await page.goto(`${process.env.WEB_URL}inventory.html`);
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("Filtering Products", async ({ productsPage }) => {
    await productsPage.filterProductsBySelection();
  });

  test("Add to Cart Products", async ({ productsPage }) => {
    await productsPage.addToCartProducts();
 
  });

  test("Check Out Products", async ({ productsPage }) => {
    await productsPage.addToCartProducts();
    await productsPage.Page.waitForTimeout(2000);
    await productsPage.checkOutProducts();
    await productsPage.assertCartMessage("Thank you for your order!")
  });

  test("Remove Products", async ({ productsPage }) => {
    await productsPage.removeProductsInProductsPage();
  });
});
