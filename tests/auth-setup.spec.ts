import { test as setup, expect } from "@playwright/test";
import path from "path";
import { LoginPage } from "../pages/LoginPage";

const authFile = path.join(__dirname, "../auth/authentication.json");

setup("authenticate", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await page.goto(String(process.env.WEB_URL));

  await loginPage.userNameField.fill(String(process.env.STANDARD_USER_UN));
  await loginPage.passwordField.fill(String(process.env.STANDARD_USER_PW));
  await loginPage.signInButton.click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL("https://www.saucedemo.com/inventory.html");

  // End of authentication steps.
  await page.context().storageState({ path: authFile });
});
