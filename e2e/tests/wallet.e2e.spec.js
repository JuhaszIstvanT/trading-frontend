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

describe("Wallet Component E2E Test", () => {
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
    await driver.wait(until.urlIs("http://localhost:4200/wallet"), 10000);
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  beforeEach(async () => {
    await driver.get("http://localhost:4200/wallet");
  });

  it("should display the wallet component", async () => {
    const walletTitle = await driver
      .wait(until.elementLocated(By.css(".container h1")), 10000)
      .getText();
    expect(walletTitle).toEqual("Wallet");

    const addressText = await driver
      .findElement(By.css(".container p strong"))
      .getText();
    expect(addressText).toEqual("Address:");
  });

  it("should navigate to trade details when clicking on a trade row", async () => {
    const firstTradeRow = await driver.wait(
      until.elementLocated(By.css("app-trade .trade-history .trade-row")),
      10000
    );
    await firstTradeRow.click();
    await driver.wait(until.urlContains("/trade/detail"), 10000);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain("/trade/detail");
  });
});

jasmine.execute();
