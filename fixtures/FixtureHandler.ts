import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ProductsPage } from "../pages/ProductsPage";

type FixturesHandler = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
};

export const test = base.extend<FixturesHandler>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  
});
