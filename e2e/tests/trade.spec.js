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

describe("TradeComponent E2E Test", () => {
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

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it("should display the trade history", async () => {
    // Ensure the trade history table is present
    const tradeHistoryTable = await driver.findElement(
      By.css(".trade-history .table")
    );
    await driver.wait(until.elementIsVisible(tradeHistoryTable), 10000);

    // Check if the trade history table has rows
    const tradeRows = await driver.findElements(
      By.css(".trade-history .trade-row")
    );
    expect(tradeRows.length).toBeGreaterThan(0);
  });

  it("should navigate to trade details when a trade row is clicked", async () => {
    // Click on the first trade row
    const firstTradeRow = await driver.findElement(
      By.css(".trade-history .trade-row")
    );
    await driver.executeScript("arguments[0].click();", firstTradeRow);

    // Wait for navigation to the trade detail page
    await driver.wait(until.urlContains("/trade/detail/"), 10000);

    // Verify the navigation by checking the URL
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain("/trade/detail/");
  });
  
});

jasmine.execute();
