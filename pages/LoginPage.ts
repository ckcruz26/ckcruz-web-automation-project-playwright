import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly Page;
  readonly userNameField: Locator;
  readonly passwordField: Locator;
  readonly signInButton: Locator;
  readonly errorMsgLocator: Locator;

  constructor(page: Page) {
    this.Page = page;
    this.userNameField = page.locator('[data-test="username"]');
    this.passwordField = page.locator('[data-test="password"]');
    this.signInButton = page.locator('[data-test="login-button"]');
    this.errorMsgLocator = page.locator('[data-test="error"]');
  }

  async loginCredentials(username: string, password: string) {
    await this.userNameField.fill(username);
    await this.passwordField.fill(password);
    await this.signInButton.click();
  }

  async validateIfContainsLink() {
    await this.Page.waitForURL("**/inventory.html");
  }

  async validateIfNotContainsLink() {
    await expect(this.Page).not.toHaveURL("**/inventory.html");
  }

  async errorMsgContainer(errorMsg: string) {
    await expect(this.errorMsgLocator).toBeVisible();
    await expect(this.errorMsgLocator).toContainText(errorMsg);
  }
}
