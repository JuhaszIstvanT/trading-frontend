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

describe("User Detail Component E2E Test", () => {
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
    await driver.get("http://localhost:4200/leaderboard");
  });

  it("should navigate to user details when clicking on a leaderboard row", async () => {
    const firstLeaderboardRow = await driver.wait(
      until.elementLocated(By.css("table tbody tr")),
      10000
    );
    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      firstLeaderboardRow
    );
    await firstLeaderboardRow.click();
    await driver.wait(until.urlContains("/user/"), 10000);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain("/user/");
  });

  it("should display user details correctly", async () => {
    const firstLeaderboardRow = await driver.wait(
      until.elementLocated(By.css("table tbody tr")),
      10000
    );
    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      firstLeaderboardRow
    );
    await firstLeaderboardRow.click();
    await driver.wait(until.urlContains("/user/"), 10000);

    const currentUrl = await driver.getCurrentUrl();
    console.log("Current URL after navigation:", currentUrl);
    expect(currentUrl).toContain("/user/");


    const usernameText = await driver
      .wait(until.elementLocated(By.id("username")), 10000)
      .getText();
    expect(usernameText).toContain("Username:");

    const profitText = await driver
      .wait(until.elementLocated(By.id("profit")), 10000)
      .getText();
    expect(profitText).toContain("Profit:");
  });

  it("should follow and unfollow a user successfully", async () => {
    const firstLeaderboardRow = await driver.wait(
      until.elementLocated(By.css("table tbody tr")),
      10000
    );
    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      firstLeaderboardRow
    );
    await firstLeaderboardRow.click();
    await driver.wait(until.urlContains("/user/"), 10000);

    // Follow the user
    const followButton = await driver.wait(
      until.elementLocated(By.id("follow-btn")),
      10000
    );
    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      followButton
    );

    // Ensure the button is visible and clickable
    await driver.wait(until.elementIsVisible(followButton), 10000);
    await driver.wait(until.elementIsEnabled(followButton), 10000);

    // // Use JavaScript to click the follow button
    await driver.executeScript("arguments[0].click();", followButton);

    // Wait for the button to change to "Unfollow"
    const unfollowButton = await driver.wait(
      until.elementLocated(By.id("unfollow-btn")),
      10000
    );
    expect(await unfollowButton.isDisplayed()).toBe(true);

    // // Unfollow the user

    // Ensure the button is visible and clickable
    await driver.wait(until.elementIsVisible(unfollowButton), 10000);
    await driver.wait(until.elementIsEnabled(unfollowButton), 10000);

    await driver.executeScript("arguments[0].click();", unfollowButton);

    // Wait for the button to change to "Follow"
    const followButtonAgain = await driver.wait(
      until.elementLocated(By.id("follow-btn")),
      10000
    );
    expect(await followButtonAgain.isDisplayed()).toBe(true);
  });

  it("should navigate back to the leaderboard", async () => {
    const firstLeaderboardRow = await driver.wait(
      until.elementLocated(By.css("table tbody tr")),
      10000
    );
    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      firstLeaderboardRow
    );
    await firstLeaderboardRow.click();
    await driver.wait(until.urlContains("/user/"), 10000);

    const backButton = await driver.findElement(By.id("back-btn"));
    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      backButton
    );

    await driver.executeScript("arguments[0].click();", backButton);

    //await backButton.click();

    // Verify that we are back on the leaderboard page
    await driver.wait(until.urlIs("http://localhost:4200/leaderboard"), 10000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toBe("http://localhost:4200/leaderboard");
  });
});

jasmine.execute();
