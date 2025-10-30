class LoginPage {
  constructor(page) {
    this.page = page;
  }
  async getEmailInput() {
    return this.page.locator('input#username');
  }

  async getPasswordInput() {
    return this.page.locator('input#password');
  }

  async getSignInButton() {
    return this.page
      .locator('button[type="submit"]')
      .filter({ hasText: 'Sign in' });
  }

  async getForgotPasswordLink() {
    return this.page.locator('a').filter({ hasText: 'Forgot password?' });
  }

  async getErrorElement() {
    return this.page
      .locator(
        '#error-for-password, .error-for-password, [data-test-id*="error"]'
      )
      .first();
  }

  async navigate() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillEmail(email) {
    const emailInput = await this.getEmailInput();
    await emailInput.fill(email);
  }

  async fillPassword(password) {
    const passwordInput = await this.getPasswordInput();
    await passwordInput.fill(password);
  }

  async clickSignIn() {
    const signInButton = await this.getSignInButton();
    await signInButton.click();
  }

  async clickForgotPassword() {
    const forgotPasswordLink = await this.getForgotPasswordLink();
    await forgotPasswordLink.click();
  }

  async isErrorVisible() {
    const errorElement = await this.getErrorElement();
    return await errorElement.isVisible();
  }

  async getErrorText() {
    const errorElement = await this.getErrorElement();
    if (await errorElement.isVisible()) {
      return await errorElement.textContent();
    }
    return null;
  }
}

module.exports = { LoginPage };
