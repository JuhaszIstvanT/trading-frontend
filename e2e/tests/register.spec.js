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

describe("Register E2E Test", () => {
  let driver;

  beforeAll(async () => {
    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments("--headless");
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(chromeOptions)
      .build();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  beforeEach(async () => {
    await driver.get("http://localhost:4200/register");
  });

  it("should display registration page", async () => {
    const title = await driver.getTitle();
    expect(title).toEqual("Register");
  });

  it("should register successfully", async () => {
    await driver.findElement(By.id("username")).sendKeys("newuseafaaddar");
    await driver.findElement(By.id("email")).sendKeys("newuser@examplew.com");
    await driver.findElement(By.id("password")).sendKeys("newpassword");
    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.wait(until.urlIs("http://localhost:4200/wallet"), 10000); // Wait up to 10 seconds for the URL to change
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toEqual("http://localhost:4200/wallet");
  });

  it("should show error for invalid email format", async () => {
    await driver.findElement(By.id("username")).sendKeys("newuser");
    await driver.findElement(By.id("email")).sendKeys("invalidemail");
    await driver.findElement(By.id("password")).sendKeys("newpassword");
    await driver.findElement(By.css('button[type="submit"]')).click();

    const errorMessageLocator = By.css(".alert.alert-danger");
    await driver.wait(until.elementLocated(errorMessageLocator), 10000); // Wait up to 10 seconds for the element to appear
    const errorMsg = await driver.findElement(errorMessageLocator).getText();
    expect(errorMsg).toContain("Email must be a valid email address.");
  });

  it("should show error for short password", async () => {
    await driver.findElement(By.id("username")).sendKeys("newuser");
    await driver.findElement(By.id("email")).sendKeys("newuser@example.com");
    await driver.findElement(By.id("password")).sendKeys("pw");
    await driver.findElement(By.css('button[type="submit"]')).click();

    const errorMessageLocator = By.css(".alert.alert-danger");
    await driver.wait(until.elementLocated(errorMessageLocator), 10000); // Wait up to 10 seconds for the element to appear
    const errorMsg = await driver.findElement(errorMessageLocator).getText();
    expect(errorMsg).toContain(
      "Password must be at least 3 characters long and contain at least one lowercase letter."
    );
  });

  it("should show error for duplicate username", async () => {
    await driver.findElement(By.id("username")).sendKeys("Sara");
    await driver.findElement(By.id("email")).sendKeys("newuser@example.com");
    await driver.findElement(By.id("password")).sendKeys("newpassword");
    await driver.findElement(By.css('button[type="submit"]')).click();

    const errorMessageLocator = By.css(".alert.alert-danger");
    await driver.wait(until.elementLocated(errorMessageLocator), 10000); // Wait up to 10 seconds for the element to appear
    const errorMsg = await driver.findElement(errorMessageLocator).getText();
    expect(errorMsg).toContain("Username 'Sara' is already taken.");
  });
});

jasmine.execute();
