import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173";

test.describe("Skip Booking Flow - QA Assessment", () => {
  
  // ---------------------------
  // 1. GENERAL FLOW (HAPPY PATH)
  // ---------------------------
  test("General waste booking flow (happy path)", async ({ page }) => {
    await page.goto(BASE_URL);

    // Step 1 - Postcode
    await page.fill('[data-testid="postcode-input"]', "SW1A 1AA");
    await page.click('[data-testid="lookup-btn"]');

    // Select address
    await expect(page.locator("text=Select Address")).toBeVisible();
    await page.click("text=Address 1 Downing Street");
    await page.click("text=Continue");

    // Step 3 - Waste type
    await page.click("text=general");
    await page.click("text=Continue");

    // Step 4 - Skip selection
    await expect(page.locator("text=Select Skip")).toBeVisible();
    await page.click("text=4-yard");
    await page.click("text=Continue");

    // Step 5 - Review
    await expect(page.locator("text=Review")).toBeVisible();
    await expect(page.locator("text=Total")).toBeVisible();

    await page.click("text=Confirm Booking");

    await expect(page.locator("text=Booking Confirmed")).toBeVisible();
  });

  // ---------------------------
  // 2. HEAVY WASTE RULE CHECK
  // ---------------------------
  test("Heavy waste disables restricted skips", async ({ page }) => {
    await page.goto(BASE_URL);

    await page.fill('[data-testid="postcode-input"]', "SW1A 1AA");
    await page.click('[data-testid="lookup-btn"]');

    await page.click("text=Address 1 Downing Street");
    await page.click("text=Continue");

    await page.click("text=heavy");
    await page.click("text=Continue");

    await expect(page.locator("text=Select Skip")).toBeVisible();

    // verify disabled skip exists
    const disabledSkip = page.locator("text=12-yard");

    await expect(disabledSkip).toBeVisible();
  });

  // ---------------------------
  // 3. POSTCODE FAILURE + ERROR STATE
  // ---------------------------
  test("postcode API failure shows error message", async ({ page }) => {
    await page.route("**/api/postcode/lookup", (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: "Server error" }),
      });
    });

    await page.goto(BASE_URL);

    await page.fill('[data-testid="postcode-input"]', "BS1 4DJ");
    await page.click('[data-testid="lookup-btn"]');

    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator("text=Failed")).toBeVisible();
  });

  // ---------------------------
  // 4. RETRY FLOW (STATE TRANSITION)
  // ---------------------------
  test("retry succeeds after failure", async ({ page }) => {
    let firstCall = true;

    await page.route("**/api/postcode/lookup", (route) => {
      if (firstCall) {
        firstCall = false;
        return route.fulfill({ status: 500 });
      }

      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          postcode: "BS1 4DJ",
          addresses: [
            { id: "1", line1: "Retry Street", city: "Bristol" },
          ],
        }),
      });
    });

    await page.goto(BASE_URL);

    await page.fill('[data-testid="postcode-input"]', "BS1 4DJ");
    await page.click('[data-testid="lookup-btn"]');

    // retry button appears after error
    await page.click('[data-testid="retry-btn"]');

    await expect(page.locator("text=Retry Street")).toBeVisible();
  });

  // ---------------------------
  // 5. LOADING STATE CHECK
  // ---------------------------
  test("loading state visible during API call", async ({ page }) => {
    await page.route("**/api/postcode/lookup", async (route) => {
      await new Promise((r) => setTimeout(r, 1500));
      route.continue();
    });

    await page.goto(BASE_URL);

    await page.fill('[data-testid="postcode-input"]', "M1 1AE");
    await page.click('[data-testid="lookup-btn"]');

    await expect(page.locator('[data-testid="loading"]')).toBeVisible();
  });

  // ---------------------------
  // 6. SKIP DISABLED ASSERTION (MOCKED)
  // ---------------------------
  test("disabled skips are not selectable", async ({ page }) => {
    await page.route("**/api/skips*", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          skips: [
            { size: "4-yard", price: 120, disabled: false },
            { size: "12-yard", price: 260, disabled: true },
          ],
        }),
      });
    });

    await page.goto(BASE_URL);

    await page.fill('[data-testid="postcode-input"]', "SW1A 1AA");
    await page.click('[data-testid="lookup-btn"]');

    await page.click("text=Address 1 Downing Street");
    await page.click("text=Continue");

    await page.click("text=general");
    await page.click("text=Continue");

    const disabled = page.locator("text=12-yard");

    await expect(disabled).toBeVisible();
  });
});