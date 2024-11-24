const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const Jasmine = require("jasmine");
const JasmineConsoleReporter = require("jasmine-console-reporter");

// Increase the default timeout interval
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

describe("Login E2E Test", () => {
  let driver;

  beforeAll(async () => {
    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments("--headless");
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(chromeOptions)
      .build();
    await driver.get("http://localhost:4200/login");
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  beforeEach(async () => {
    await driver.get("http://localhost:4200/login");
  });

  it("should display login page", async () => {
    const title = await driver.getTitle();
    expect(title).toEqual("Login");
  });

  it("should login successfully", async () => {
    await driver.findElement(By.name("username")).sendKeys("Sara");
    await driver.findElement(By.name("password")).sendKeys("Passwordsara");
    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.wait(until.urlIs("http://localhost:4200/wallet"), 10000); // Wait up to 10 seconds for the URL to change
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toEqual("http://localhost:4200/wallet");
  });

  it("should show error for incorrect credentials", async () => {
    await driver.findElement(By.name("username")).clear();
    await driver.findElement(By.name("password")).clear();

    await driver.findElement(By.name("username")).sendKeys("wronguser");
    await driver.findElement(By.name("password")).sendKeys("wrongpassword");
    await driver.findElement(By.css('button[type="submit"]')).click();

    const errorMessageLocator = By.id("error-message");
    await driver.wait(until.elementLocated(errorMessageLocator), 10000); // Wait up to 10 seconds for the element to appear
    const errorMsg = await driver.findElement(errorMessageLocator).getText();
    expect(errorMsg).toContain(
      "Invalid username or password. Please try again."
    );
  });
});

jasmine.execute();
