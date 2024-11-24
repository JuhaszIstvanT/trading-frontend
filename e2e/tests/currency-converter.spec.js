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

describe("CurrencyConverterComponent E2E Test", () => {
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

  beforeEach(async () => {
    await driver.get("http://localhost:4200/market");
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it("should navigate to the currency converter component and perform a trade", async () => {

    // Wait for the market page to load
    await driver.wait(until.urlIs("http://localhost:4200/market"), 10000);

    //Wait for the table and click on the Trade button for the first currency
    const firstCurrencyTradeButton = await driver.wait(
      until.elementLocated(By.css(".currency-row .btn-primary")),
      10000
    );
    await driver.executeScript("arguments[0].click();", firstCurrencyTradeButton);

    await driver.wait(until.urlContains("/trade/"), 10000);

    // Enter amount to convert
    const amountInput = await driver.findElement(By.id("amountInput"));
    await amountInput.clear();
    await amountInput.sendKeys("1");

    // Select target currency from the dropdown
    const currencySelect = await driver.findElement(By.css("select"));
    await currencySelect.sendKeys("USD");

    // Verify the conversion result
    const conversionResult = await driver
      .findElement(By.css(".conversion-result"))
      .getText();
    expect(conversionResult).toContain("USD");

    // Perform the trade
    const tradeButton = await driver.findElement(By.css(".btn.btn-primary"));
    await tradeButton.click();

    // Wait for trade success message
    const successMessage = await driver.wait(
      until.elementLocated(By.css(".alert-success")),
      10000
    );
    const successText = await successMessage.getText();
    expect(successText).toContain("Trade successful");
  });
});

jasmine.execute();
