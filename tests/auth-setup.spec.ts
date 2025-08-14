import { test as setup, expect } from "@playwright/test";
import path from "path";
import fs from "fs";
import { LoginPage } from "../pages/LoginPage";

const authFile = path.join(__dirname, "../auth/authentication.json");

setup("authenticate", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await page.goto(String(process.env.WEB_URL));

  await loginPage.userNameField.fill(String(process.env.STANDARD_USER_UN));
  await loginPage.passwordField.fill(String(process.env.STANDARD_USER_PW));
  await loginPage.signInButton.click();

  await page.waitForURL("https://www.saucedemo.com/inventory.html");

  // Save storage state first
  await page.context().storageState({ path: authFile });

  // Read and modify the JSON file to set expires = -1
  const authData = JSON.parse(fs.readFileSync(authFile, "utf-8"));

  if (authData.cookies && Array.isArray(authData.cookies)) {
    authData.cookies = authData.cookies.map(cookie => ({
      ...cookie,
      expires: -1
    }));
  }

  // Save the modified JSON back
  fs.writeFileSync(authFile, JSON.stringify(authData, null, 2));
});
