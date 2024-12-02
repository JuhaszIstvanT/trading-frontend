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

describe("WatchlistComponent E2E Test", () => {
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

    // Wait for navigation to /watchlist
    await driver.wait(until.urlIs("http://localhost:4200/wallet")); // Adjust the URL as needed
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  beforeEach(async () => {
    await driver.get("http://localhost:4200/watchlist"); // Ensure we are on the watchlist page for each test
  });

    it("should display the watchlist", async () => {
      // Wait for the watchlist table to be present
      await driver.wait(until.elementLocated(By.id("watchlist-table")), 10000);
      console.log("Watchlist table located.");

      // Wait for the trade rows to be present
      const watchlistRows = await driver.wait(
        until.elementsLocated(By.css("#watchlist-table .align-middle")),
        10000
      );
      console.log("Watchlist rows located.");

      const watchlistRowCount = watchlistRows.length;
      console.log(`Number of watchlist rows: ${watchlistRowCount}`);

      expect(watchlistRowCount).toBeGreaterThan(0);
    });
});

jasmine.execute();
