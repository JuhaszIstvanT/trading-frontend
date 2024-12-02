const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const Jasmine = require("jasmine");
const JasmineConsoleReporter = require("jasmine-console-reporter");

const jasmine = new Jasmine();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000; // Increase to 15 seconds
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

describe("WithdrawalModal E2E Test", () => {
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
    await driver.findElement(By.name("username")).sendKeys("Sara");
    await driver.findElement(By.name("password")).sendKeys("Passwordsara");
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Wait for navigation to /wallet
    await driver.wait(until.urlIs("http://localhost:4200/wallet")); // Adjust the URL as needed
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  beforeEach(async () => {
    await driver.get("http://localhost:4200/wallet"); // Ensure we are on the wallet page for each test

    // Ensure the withdrawal button is visible and enabled before clicking
    const openModalButton = await driver.findElement(
      By.id("open-withdrawal-modal-button")
    );
    await driver.wait(until.elementIsVisible(openModalButton));
    await driver.wait(until.elementIsEnabled(openModalButton));

    // Click the button to open the withdrawal modal
    await driver.executeScript("arguments[0].click();", openModalButton);

    // Wait for the withdrawal modal to be fully visible
    await driver.wait(until.elementLocated(By.id("withdrawalModalLabel")));
    await driver.wait(
      until.elementIsVisible(driver.findElement(By.id("withdrawalModalLabel")))
    );
  });

  it("should display the withdrawal modal", async () => {
    const title = await driver
      .findElement(By.id("withdrawalModalLabel"))
      .getText();
    expect(title).toEqual("Withdrawal");
  });

  it("should successfully withdraw funds", async () => {
    await driver.findElement(By.id("cardNumber")).sendKeys("9688641596858705"); // Valid card number for testing
    await driver.findElement(By.id("withdrawalCurrency")).sendKeys("USD");
    await driver.findElement(By.id("withdrawalAmount")).sendKeys("1");
    await driver.findElement(By.css('button[type="submit"]')).click();

    const successMessageLocator = By.css(".alert.alert-success");
    await driver.wait(until.elementLocated(successMessageLocator), 10000); // Wait up to 10 seconds for the element to appear
    const successMsg = await driver
      .findElement(successMessageLocator)
      .getText();
    expect(successMsg).toContain("Withdrawal was successful!");
  });

  it("should show error for invalid card number", async () => {
    await driver.findElement(By.id("cardNumber")).sendKeys("1234567890123456"); // Invalid card number
    await driver.findElement(By.id("withdrawalCurrency")).sendKeys("USD");
    await driver.findElement(By.id("withdrawalAmount")).sendKeys("1");
    await driver.findElement(By.css('button[type="submit"]')).click();

    const errorMessageLocator = By.css(".text-danger");
    await driver.wait(until.elementLocated(errorMessageLocator), 10000); // Wait up to 10 seconds for the element to appear
    const errorMsg = await driver.findElement(errorMessageLocator).getText();
    expect(errorMsg).toContain("Invalid debit card number");
  });
});

jasmine.execute();
