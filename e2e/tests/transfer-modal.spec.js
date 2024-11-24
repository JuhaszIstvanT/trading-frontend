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

describe("TransferModal E2E Test", () => {
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
    await driver.wait(until.urlIs("http://localhost:4200/wallet"), 10000); // Adjust the URL as needed
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  beforeEach(async () => {
    await driver.get("http://localhost:4200/wallet"); // Ensure we are on the wallet page for each test

    // Ensure the transfer button is visible and enabled before clicking
    const openModalButton = await driver.findElement(
      By.id("open-transfer-modal-button")
    );
    await driver.wait(until.elementIsVisible(openModalButton));
    await driver.wait(until.elementIsEnabled(openModalButton));

    // Click the button to open the transfer modal
    await driver.executeScript("arguments[0].click();", openModalButton);

    // Wait for the transfer modal to be fully visible
    await driver.wait(until.elementLocated(By.id("transferModalLabel")));
    await driver.wait(
      until.elementIsVisible(driver.findElement(By.id("transferModalLabel")))
    );
  });

  it("should display the transfer modal", async () => {
    const title = await driver
      .findElement(By.id("transferModalLabel"))
      .getText();
    expect(title).toEqual("Transfer");
  });

  it("should successfully transfer funds", async () => {
    await driver.findElement(By.id("from")).sendKeys("sjIBPYcGRrOu7smJR7SoViIUb2a5nyXhJgwXh72V/ao=");
    await driver.findElement(By.id("to")).sendKeys("Kl2NndqEo3sFCccynSOzvZ3lbkT8kylFcZdI+u+7Yyc=");
    await driver.findElement(By.id("currency")).sendKeys("USD");
    await driver.findElement(By.id("amount")).sendKeys("100");
    await driver.findElement(By.css('button[type="submit"]')).click();

    const successMessageLocator = By.css(".alert.alert-success");
    await driver.wait(until.elementLocated(successMessageLocator), 10000); // Wait up to 10 seconds for the element to appear
    const successMsg = await driver
      .findElement(successMessageLocator)
      .getText();
    expect(successMsg).toContain("Transfer was successful!");
  });

  it("should show error for missing required fields", async () => {
    await driver.findElement(By.id("from")).clear();
    await driver.findElement(By.id("to")).clear();
    await driver.findElement(By.id("amount")).clear();

    await driver.findElement(By.css('button[type="submit"]')).click();

    const errorMessageLocator = By.css(".text-danger");
    await driver.wait(until.elementLocated(errorMessageLocator), 10000); // Wait up to 10 seconds for the element to appear
    const errorMsg = await driver.findElements(errorMessageLocator);
    expect(errorMsg.length).toBeGreaterThan(0); // There should be error messages
  });

  it("should show error for invalid addresses", async () => {
    await driver.findElement(By.id("from")).sendKeys("invalid-source-address");
    await driver
      .findElement(By.id("to"))
      .sendKeys("invalid-destination-address");
    await driver.findElement(By.id("currency")).sendKeys("USD");
    await driver.findElement(By.id("amount")).sendKeys("100");
    await driver.findElement(By.css('button[type="submit"]')).click();

    const errorMessageLocator = By.css(".alert.alert-danger");
    await driver.wait(until.elementLocated(errorMessageLocator), 10000); // Wait up to 10 seconds for the element to appear
    const errorMsg = await driver.findElement(errorMessageLocator).getText();
    expect(errorMsg).toContain("Failed to process transfer. Please try again.");
  });
});

jasmine.execute();
