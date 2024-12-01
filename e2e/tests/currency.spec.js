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

describe("CurrencyComponent E2E Test", () => {
  let driver;

  beforeAll(async () => {
    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments("--headless");
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(chromeOptions)
      .build();
    await driver.get("http://localhost:4200/login");

    // Perform login
    await driver.findElement(By.name("username")).sendKeys("Sara");
    await driver.findElement(By.name("password")).sendKeys("Passwordsara");
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Wait for navigation to /wallet
    await driver.wait(until.urlIs("http://localhost:4200/wallet"), 10000);
  });

  beforeEach(async () => {
    await driver.get("http://localhost:4200/market");
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it("should navigate to the market page", async () => {
    // Wait for the market page to load
    await driver.wait(until.urlIs("http://localhost:4200/market"), 10000);
  });

  it("should navigate to trade page for a currency", async () => {
    // Wait for the trade button with id 'bitcoin' to be present
    const firstCurrencyTradeButton = await driver.wait(
      until.elementLocated(By.id("bitcoin")),
      10000
    );

    // Ensure the button is visible before clicking it
    await driver.wait(until.elementIsVisible(firstCurrencyTradeButton), 10000);

    // Click the trade button
    await driver.executeScript(
      "arguments[0].click();",
      firstCurrencyTradeButton
    );

    // Wait for navigation to the currency converter page
    await driver.wait(until.urlContains("/trade/"), 10000);

    // Verify the navigation by checking the URL
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain("/trade/");
  });
});

jasmine.execute();
