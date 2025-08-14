import { test } from "../fixtures/FixtureHandler";

test.describe("Login Suite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(String(process.env.WEB_URL));
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("Valid login credentials", async ({ loginPage }) => {
    await loginPage.loginCredentials(
      String(process.env.STANDARD_USER_UN),
      String(process.env.STANDARD_USER_PW)
    );
    await loginPage.validateIfContainsLink();
  });

  test("Invalid Credentials", async ({ loginPage }) => {
    await loginPage.loginCredentials(
      String(process.env.STANDARD_USER_UN),
      String(process.env.GENERAL_INVALID_PW)
    );

    await loginPage.errorMsgContainer(
      "Epic sadface: Username and password do not match any user in this service"
    );

    await loginPage.validateIfNotContainsLink();
  });

  test("Login the locked out user account", async ({ loginPage }) => {
    await loginPage.loginCredentials(
      String(process.env.LOCKOUT_USER_UN),
      String(process.env.LOCKOUT_USER_PW)
    );

    await loginPage.errorMsgContainer(
      "Epic sadface: Sorry, this user has been locked out."
    );
    await loginPage.validateIfNotContainsLink();
  });
});
