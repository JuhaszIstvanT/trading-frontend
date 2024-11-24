const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const Jasmine = require("jasmine");
const JasmineConsoleReporter = require("jasmine-console-reporter");

const jasmine = new Jasmine();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000; // Increase to 20 seconds
jasmine.env.clearReporters();
jasmine.addReporter(
  new JasmineConsoleReporter({
    colors: 1, // (0|false)|(1|true)|2
    cleanStack: 1, // (0|false)|(1|true)|2|3
    verbosity: 4, // (0|false)|1|2|(3|true)|4|Object
    listStyle: "indent", // "flat"|"indent"
    activity: false,
  })
);

describe("ProfileComponent E2E Test", () => {
  let driver;

  beforeAll(async () => {
    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments("--headless");
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(chromeOptions)
      .build();
    await driver.get("http://localhost:4200/login"); // Navigate to login page

    // Perform login
    await driver.findElement(By.name("username")).sendKeys("SaraUpdated");
    await driver.findElement(By.name("password")).sendKeys("NewerPasswordsara");
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Wait for navigation to /wallet
    await driver.wait(until.urlIs("http://localhost:4200/wallet"), 10000); // Adjust the URL as needed
  });

  beforeEach(async () => {
    await driver.get("http://localhost:4200/profile");
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it("should navigate to the profile page", async () => {
    // Wait for the profile page to load
    await driver.wait(until.urlIs("http://localhost:4200/profile"), 10000);
  });

  it("should display the user's profile information", async () => {
    // Verify that the profile information is displayed
    const nameInput = await driver.findElement(By.id("name"));
    const emailInput = await driver.findElement(By.id("email"));

    const nameValue = await nameInput.getAttribute("value");
    const emailValue = await emailInput.getAttribute("value");

    expect(nameValue).toBe("SaraUpdated"); // Adjust based on your test data
    expect(emailValue).toBe("saraupdated@example.com"); // Adjust based on your test data
  });

  it("should update personal information", async () => {
    const nameInput = await driver.findElement(By.id("name"));
    const emailInput = await driver.findElement(By.id("email"));
    const saveChangesButton = await driver.findElement(By.id("save"));

    await nameInput.clear();
    await nameInput.sendKeys("SaraUpdated");
    await emailInput.clear();
    await emailInput.sendKeys("saraupdated@example.com");

    await driver.executeScript("arguments[0].click();", saveChangesButton);

    // Wait for the success message to be present
    const successMessage = await driver.wait(
      until.elementLocated(By.id("successMessageProfile")),
      10000 // Wait up to 10 seconds
    );

    // Ensure the success message is visible
    await driver.wait(until.elementIsVisible(successMessage), 10000);

    const successText = await successMessage.getText();
    expect(successText).toContain("Profile updated successfully");
  });

    it("should reset password", async () => {
      const oldPasswordInput = await driver.findElement(By.id("oldPassword"));
      const newPasswordInput = await driver.findElement(By.id("newPassword"));
      const confirmPasswordInput = await driver.findElement(
        By.id("confirmPassword")
      );
      const resetPasswordButton = await driver.findElement(
        By.id("resetpwd")
      );

      await oldPasswordInput.sendKeys("NewerPasswordsara");
      await newPasswordInput.sendKeys("Passwordsara");
      await confirmPasswordInput.sendKeys("Passwordsara");

      await driver.executeScript("arguments[0].click();", resetPasswordButton);

      // Wait for the success message
      const successMessage = await driver.wait(
        until.elementLocated(By.css(".alert.alert-success")),
        10000
      );
      const successText = await successMessage.getText();
      expect(successText).toContain("Password reset successful");
    });

  //   it("should navigate to followed trader's profile", async () => {
  //     // Wait for followed trader's list to be visible
  //     const followedTrader = await driver.wait(
  //       until.elementLocated(By.css(".list-group-item")),
  //       10000
  //     );
  //     await driver.executeScript("arguments[0].click();", followedTrader);

  //     // Wait for the trader's profile page to load
  //     await driver.wait(until.urlContains("/user/"), 10000);

  //     // Verify the navigation by checking the URL
  //     const currentUrl = await driver.getCurrentUrl();
  //     expect(currentUrl).toContain("/user/");
  //   });
});

jasmine.execute();
