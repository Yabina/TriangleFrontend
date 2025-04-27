import { test, expect } from "@playwright/test";

/**
 * Playwright Test Suite for Quadrilateral Frontend
 *
 * Covers:
 * - Valid POST, GET, PUT, DELETE operations
 * - Frontend null validation
 * - API error handling when no POST has occurred
 */

// Environment toggle: 'prod' or 'local'
const ENV = 'local'; // Change to 'local' when testing locally

const BASE_URL = ENV === 'prod'
    ? "https://trianglefrontend-production.up.railway.app/"
    : "http://localhost:4200/";

// Set up shared steps before each test
test.beforeEach(async ({ page }) => {
    await page.route("**/quad/type", (route) => route.continue());
    await page.goto(BASE_URL);
});

// Group: Quadrilateral API Tests

test.describe('Quadrilateral API Tests', () => {

    test("post quad - square", async ({ page }) => {
        await page.getByRole("spinbutton", { name: "Side A" }).fill("4");
        await page.getByRole("spinbutton", { name: "Side B" }).fill("4");
        await page.getByRole("spinbutton", { name: "Side C" }).fill("4");
        await page.getByRole("spinbutton", { name: "Side D" }).fill("4");
        await page.getByRole("button", { name: "Create (POST)" }).click();

        const response = await page.waitForResponse((response) =>
        response.url().includes("/quad/type") && response.status() === 200
        );
        const responseBody = await response.json();
        expect(responseBody.type).toBe("Type of Quadrilateral: Square");
    });

    test("get quad - read", async ({ page }) => {
        await page.getByRole("button", { name: "Read (GET)" }).click();

        const response = await page.waitForResponse((response) =>
        response.url().includes("/quad/type") && response.status() === 200
        );
        expect(response.status()).toBe(200);
    });

    test("put quad - update", async ({ page }) => {
        await page.getByRole("spinbutton", { name: "Side A" }).fill("5");
        await page.getByRole("spinbutton", { name: "Side B" }).fill("5");
        await page.getByRole("spinbutton", { name: "Side C" }).fill("5");
        await page.getByRole("spinbutton", { name: "Side D" }).fill("5");
        await page.getByRole("button", { name: "Update (PUT)" }).click();

        const response = await page.waitForResponse((response) =>
        response.url().includes("/quad/type") && response.status() === 200
        );
        const responseBody = await response.json();
        expect(responseBody.type).toBe("Type of Quadrilateral: Square");
    });

    test("put quad - update rectangle", async ({ page }) => {
        await page.getByRole("spinbutton", { name: "Side A" }).fill("5");
        await page.getByRole("spinbutton", { name: "Side B" }).fill("3");
        await page.getByRole("spinbutton", { name: "Side C" }).fill("5");
        await page.getByRole("spinbutton", { name: "Side D" }).fill("3");
        await page.getByRole("button", { name: "Update (PUT)" }).click();

        const response = await page.waitForResponse((response) =>
        response.url().includes("/quad/type") && response.status() === 200
        );
        const responseBody = await response.json();
        expect(responseBody.type).toBe("Type of Quadrilateral: Rectangle");
    });

    test("delete quad - delete", async ({ page }) => {
        await page.getByRole("button", { name: "Delete (DELETE)" }).click();

        const response = await page.waitForResponse((response) =>
        response.url().includes("/quad/type") && response.status() === 200
        );
        const responseBody = await response.json();
        expect(responseBody.type).toBe("Quadrilateral data has been reset.");
    });

});

// Group: Frontend Validation Tests

test.describe('Frontend Validation Tests', () => {

    test("post quad - frontend null check", async ({ page }) => {
        await page.getByRole("spinbutton", { name: "Side A" }).fill("");
        await page.getByRole("spinbutton", { name: "Side B" }).fill("");
        await page.getByRole("spinbutton", { name: "Side C" }).fill("");
        await page.getByRole("spinbutton", { name: "Side D" }).fill("");
        await page.getByRole("button", { name: "Create (POST)" }).click();

        const errorMessageVisible = await page.locator("text=Please enter valid numbers for all sides.").isVisible();
        expect(errorMessageVisible).toBe(true);
    });

    });

    // Group: No POST First Error Tests

    test.describe('No Post First Error Tests', () => {

    test("get quad - no post first", async ({ page }) => {
        await page.getByRole("button", { name: "Read (GET)" }).click();

        const response = await page.waitForResponse((response) =>
        response.url().includes("/quad/type") && response.status() === 400
        );
        expect(response.status()).toBe(400);
    });

    test("put quad - no post first", async ({ page }) => {
        await page.getByRole("spinbutton", { name: "Side A" }).fill("5");
        await page.getByRole("spinbutton", { name: "Side B" }).fill("5");
        await page.getByRole("spinbutton", { name: "Side C" }).fill("5");
        await page.getByRole("spinbutton", { name: "Side D" }).fill("5");
        await page.getByRole("button", { name: "Update (PUT)" }).click();

        const response = await page.waitForResponse((response) =>
        response.url().includes("/quad/type") && response.status() === 400
        );
        expect(response.status()).toBe(400);
    });

    test("delete quad - no post first", async ({ page }) => {
        await page.getByRole("button", { name: "Delete (DELETE)" }).click();

        const response = await page.waitForResponse((response) =>
        response.url().includes("/quad/type") && response.status() === 400
        );
        expect(response.status()).toBe(400);
    });

});

/*
// Group: New Backend Features Tests (commented out until prod backend is updated)

test.describe('New Backend Features Tests', () => {

    test("post quad - kite", async ({ page }) => {
        await page.getByRole("spinbutton", { name: "Side A" }).fill("5");
        await page.getByRole("spinbutton", { name: "Side B" }).fill("5");
        await page.getByRole("spinbutton", { name: "Side C" }).fill("7");
        await page.getByRole("spinbutton", { name: "Side D" }).fill("7");
        await page.getByRole("button", { name: "Create (POST)" }).click();

        const response = await page.waitForResponse(response =>
        response.url().includes("/quad/type") && response.status() === 200
        );
        const responseBody = await response.json();
        expect(responseBody.type).toBe("Type of Quadrilateral: Kite");
    });

    test("post quad - parallelogram", async ({ page }) => {
        await page.getByRole("spinbutton", { name: "Side A" }).fill("6");
        await page.getByRole("spinbutton", { name: "Side B" }).fill("6");
        await page.getByRole("spinbutton", { name: "Side C" }).fill("8");
        await page.getByRole("spinbutton", { name: "Side D" }).fill("8");
        await page.getByRole("button", { name: "Create (POST)" }).click();

        const response = await page.waitForResponse(response =>
        response.url().includes("/quad/type") && response.status() === 200
        );
        const responseBody = await response.json();
        expect(responseBody.type).toBe("Type of Quadrilateral: Parallelogram");
    });

});
*/
