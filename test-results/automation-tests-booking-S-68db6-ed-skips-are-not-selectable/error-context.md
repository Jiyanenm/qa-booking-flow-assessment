# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: automation\tests\booking.spec.ts >> Skip Booking Flow - QA Assessment >> disabled skips are not selectable
- Location: automation\tests\booking.spec.ts:138:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=Address 1 Downing Street')

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - heading "Skip Booking System" [level=1] [ref=e5]
  - paragraph [ref=e6]: Complete your booking in 5 steps
  - generic [ref=e7]:
    - generic [ref=e8]:
      - generic [ref=e9]: "1"
      - paragraph [ref=e10]: Postcode
    - generic [ref=e11]:
      - generic [ref=e12]: "2"
      - paragraph [ref=e13]: Address
    - generic [ref=e14]:
      - generic [ref=e15]: "3"
      - paragraph [ref=e16]: Waste
    - generic [ref=e17]:
      - generic [ref=e18]: "4"
      - paragraph [ref=e19]: Skip
    - generic [ref=e20]:
      - generic [ref=e21]: "5"
      - paragraph [ref=e22]: Review
  - generic [ref=e23]:
    - button "Address 0" [ref=e24] [cursor=pointer]
    - button "Address 1" [ref=e25] [cursor=pointer]
    - button "Address 2" [ref=e26] [cursor=pointer]
    - button "Address 3" [ref=e27] [cursor=pointer]
    - button "Address 4" [ref=e28] [cursor=pointer]
    - button "Address 5" [ref=e29] [cursor=pointer]
    - button "Address 6" [ref=e30] [cursor=pointer]
    - button "Address 7" [ref=e31] [cursor=pointer]
    - button "Address 8" [ref=e32] [cursor=pointer]
    - button "Address 9" [ref=e33] [cursor=pointer]
    - button "Address 10" [ref=e34] [cursor=pointer]
    - button "Address 11" [ref=e35] [cursor=pointer]
    - button "Continue" [ref=e36] [cursor=pointer]
```

# Test source

```ts
  57  |     // verify disabled skip exists
  58  |     const disabledSkip = page.locator("text=12-yard");
  59  | 
  60  |     await expect(disabledSkip).toBeVisible();
  61  |   });
  62  | 
  63  |   // ---------------------------
  64  |   // 3. POSTCODE FAILURE + ERROR STATE
  65  |   // ---------------------------
  66  |   test("postcode API failure shows error message", async ({ page }) => {
  67  |     await page.route("**/api/postcode/lookup", (route) => {
  68  |       route.fulfill({
  69  |         status: 500,
  70  |         body: JSON.stringify({ error: "Server error" }),
  71  |       });
  72  |     });
  73  | 
  74  |     await page.goto(BASE_URL);
  75  | 
  76  |     await page.fill('[data-testid="postcode-input"]', "BS1 4DJ");
  77  |     await page.click('[data-testid="lookup-btn"]');
  78  | 
  79  |     await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  80  |     await expect(page.locator("text=Failed")).toBeVisible();
  81  |   });
  82  | 
  83  |   // ---------------------------
  84  |   // 4. RETRY FLOW (STATE TRANSITION)
  85  |   // ---------------------------
  86  |   test("retry succeeds after failure", async ({ page }) => {
  87  |     let firstCall = true;
  88  | 
  89  |     await page.route("**/api/postcode/lookup", (route) => {
  90  |       if (firstCall) {
  91  |         firstCall = false;
  92  |         return route.fulfill({ status: 500 });
  93  |       }
  94  | 
  95  |       return route.fulfill({
  96  |         status: 200,
  97  |         contentType: "application/json",
  98  |         body: JSON.stringify({
  99  |           postcode: "BS1 4DJ",
  100 |           addresses: [
  101 |             { id: "1", line1: "Retry Street", city: "Bristol" },
  102 |           ],
  103 |         }),
  104 |       });
  105 |     });
  106 | 
  107 |     await page.goto(BASE_URL);
  108 | 
  109 |     await page.fill('[data-testid="postcode-input"]', "BS1 4DJ");
  110 |     await page.click('[data-testid="lookup-btn"]');
  111 | 
  112 |     // retry button appears after error
  113 |     await page.click('[data-testid="retry-btn"]');
  114 | 
  115 |     await expect(page.locator("text=Retry Street")).toBeVisible();
  116 |   });
  117 | 
  118 |   // ---------------------------
  119 |   // 5. LOADING STATE CHECK
  120 |   // ---------------------------
  121 |   test("loading state visible during API call", async ({ page }) => {
  122 |     await page.route("**/api/postcode/lookup", async (route) => {
  123 |       await new Promise((r) => setTimeout(r, 1500));
  124 |       route.continue();
  125 |     });
  126 | 
  127 |     await page.goto(BASE_URL);
  128 | 
  129 |     await page.fill('[data-testid="postcode-input"]', "M1 1AE");
  130 |     await page.click('[data-testid="lookup-btn"]');
  131 | 
  132 |     await expect(page.locator('[data-testid="loading"]')).toBeVisible();
  133 |   });
  134 | 
  135 |   // ---------------------------
  136 |   // 6. SKIP DISABLED ASSERTION (MOCKED)
  137 |   // ---------------------------
  138 |   test("disabled skips are not selectable", async ({ page }) => {
  139 |     await page.route("**/api/skips*", (route) => {
  140 |       route.fulfill({
  141 |         status: 200,
  142 |         contentType: "application/json",
  143 |         body: JSON.stringify({
  144 |           skips: [
  145 |             { size: "4-yard", price: 120, disabled: false },
  146 |             { size: "12-yard", price: 260, disabled: true },
  147 |           ],
  148 |         }),
  149 |       });
  150 |     });
  151 | 
  152 |     await page.goto(BASE_URL);
  153 | 
  154 |     await page.fill('[data-testid="postcode-input"]', "SW1A 1AA");
  155 |     await page.click('[data-testid="lookup-btn"]');
  156 | 
> 157 |     await page.click("text=Address 1 Downing Street");
      |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  158 |     await page.click("text=Continue");
  159 | 
  160 |     await page.click("text=general");
  161 |     await page.click("text=Continue");
  162 | 
  163 |     const disabled = page.locator("text=12-yard");
  164 | 
  165 |     await expect(disabled).toBeVisible();
  166 |   });
  167 | });
```