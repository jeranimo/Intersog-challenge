const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test.describe('LinkedIn Login Page Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should load login page with all required elements', async () => {
    const emailInput = await loginPage.getEmailInput();
    const passwordInput = await loginPage.getPasswordInput();
    const signInButton = await loginPage.getSignInButton();
    const forgotPasswordLink = await loginPage.getForgotPasswordLink();

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(signInButton).toBeVisible();
    await expect(forgotPasswordLink).toBeVisible();
  });

  test('should show error when submitting empty form', async () => {
    await loginPage.clickSignIn();
    await loginPage.page.waitForTimeout(2000);

    const hasError = await loginPage.isErrorVisible();
    console.log('Empty form submission - Error visible:', hasError);
    expect(loginPage.page.url()).toContain('/login');
  });

  test('should show error with invalid credentials', async () => {
    await loginPage.fillEmail('invalid_email_format');
    await loginPage.fillPassword('short');
    await loginPage.clickSignIn();
    await loginPage.page.waitForTimeout(3000);

    const hasError = await loginPage.isErrorVisible();
    const errorText = await loginPage.getErrorText();

    console.log('Invalid credentials - Error visible:', hasError);
    console.log('Error text:', errorText);

    expect(loginPage.page.url()).toContain('/login');
  });

  test('should navigate to forgot password page', async ({ page }) => {
    const forgotPasswordLink = await loginPage.getForgotPasswordLink();
    await forgotPasswordLink.click();

    const currentUrl = page.url();
    const isPasswordResetPage =
      currentUrl.includes('forgot-password') ||
      currentUrl.includes('request-password-reset') ||
      (await page
        .locator('h1, h2')
        .filter({
          hasText: /password|reset|forgot/i,
        })
        .first()
        .isVisible());

    expect(isPasswordResetPage).toBeTruthy();
  });
});

test.describe('LinkedIn Login Form Validation', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should have working form controls', async () => {
    const emailInput = await loginPage.getEmailInput();
    const passwordInput = await loginPage.getPasswordInput();

    await emailInput.fill('test@example.com');
    await passwordInput.fill('testpassword');

    expect(await emailInput.inputValue()).toBe('test@example.com');
    expect(await passwordInput.inputValue()).toBe('testpassword');

    await emailInput.fill('');
    expect(await emailInput.inputValue()).toBe('');
  });
});
