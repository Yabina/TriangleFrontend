import { test, expect } from "@playwright/test";

/**
 * Test cases to check the response of the quadrilateral API.
 * The tests cover the following scenarios:
 * 1. POST request with all sides equal (Square)
 * 2. GET request to read the quadrilateral type
 * 3. PUT request to update the quadrilateral type
 * 4. PUT request to update the quadrilateral type to Rectangle
 * 5. DELETE request to delete the quadrilateral type
 */
test("post quad - square", async ({ page }) => {
    await page.route("**/quad/type", (route) =>
        route.continue()
    );

    await page.goto("https://trianglefrontend-production.up.railway.app/");
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
    await page.route("**/quad/type", (route) =>
        route.continue()
    );

    await page.goto("https://trianglefrontend-production.up.railway.app/");
    await page.getByRole("button", { name: "Read (GET)" }).click();

    const response = await page.waitForResponse((response) =>
        response.url().includes("/quad/type") && response.status() === 200
    );
    expect(response.status()).toBe(200); // Check for a successful 200 status code
});

test("put quad - update", async ({ page }) => {
    await page.route("**/quad/type", (route) =>
        route.continue()
    );

    await page.goto("https://trianglefrontend-production.up.railway.app/");
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

// test("put quad - update - rectangle", async ({ page }) => {
//     await page.route("**/quad/type", (route) =>
//         route.continue()
//     );

//     await page.goto("https://trianglefrontend-production.up.railway.app/");
//     await page.getByRole("spinbutton", { name: "Side A" }).fill("5");
//     await page.getByRole("spinbutton", { name: "Side B" }).fill("3");
//     await page.getByRole("spinbutton", { name: "Side C" }).fill("3");
//     await page.getByRole("spinbutton", { name: "Side D" }).fill("5");
//     await page.getByRole("button", { name: "Update (PUT)" }).click();

//     const response = await page.waitForResponse((response) =>
//         response.url().includes("/quad/type") && response.status() === 200
//     );
//     const responseBody = await response.json();
//     expect(responseBody.type).toBe("Type of Quadrilateral: Rectangle");
// });

test("delete quad - delete", async ({ page }) => {
    await page.route("**/quad/type", (route) =>
        route.continue()
    );

    await page.goto("https://trianglefrontend-production.up.railway.app/");
    await page.getByRole("button", { name: "Delete (DELETE)" }).click();

    const response = await page.waitForResponse((response) =>
        response.url().includes("/quad/type") && response.status() === 200
    );
    const responseBody = await response.json();
    expect(responseBody.type).toBe("Quadrilateral data has been reset.");
});

/**
 * Test case to check the response when all sides are null.
 */
test("post quad - frontend null check", async ({ page }) => {
    await page.goto("https://trianglefrontend-production.up.railway.app/");

    // Leave all input fields empty
    await page.getByRole("spinbutton", { name: "Side A" }).fill("");
    await page.getByRole("spinbutton", { name: "Side B" }).fill("");
    await page.getByRole("spinbutton", { name: "Side C" }).fill("");
    await page.getByRole("spinbutton", { name: "Side D" }).fill("");

    // Attempt to click the "Create (POST)" button
    await page.getByRole("button", { name: "Create (POST)" }).click();

    // Check if the error message is displayed
    const errorMessage = await page.locator("text=Please fill in all 4 sides before submitting.").isVisible();
    expect(errorMessage).toBe(true);

    // Ensure no network request was made
    // const requests = await page.waitForRequest("**/quad/type").catch(() => null);
    // expect(requests).toBeNull(); // No request should be sent
});

/**
 * Test cases to check the response when user tries to GET, PUT, DELETE before POST
 */
test("get quad - no post first", async ({ page }) => {
    await page.route("**/quad/type", (route) =>
        route.continue()
    );

    await page.goto("https://trianglefrontend-production.up.railway.app/");
    await page.getByRole("button", { name: "Read (GET)" }).click();

    const response = await page.waitForResponse((response) =>
        response.url().includes("/quad/type") && response.status() === 400
    );
    expect(response.status()).toBe(400); // Check for a 400 status code
});

test("put quad - no post first", async ({ page }) => {
    await page.route("**/quad/type", (route) =>
        route.continue()
    );

    await page.goto("https://trianglefrontend-production.up.railway.app/");
    await page.getByRole("spinbutton", { name: "Side A" }).fill("5");
    await page.getByRole("spinbutton", { name: "Side B" }).fill("5");
    await page.getByRole("spinbutton", { name: "Side C" }).fill("5");
    await page.getByRole("spinbutton", { name: "Side D" }).fill("5");
    await page.getByRole("button", { name: "Update (PUT)" }).click();

    const response = await page.waitForResponse((response) =>
        response.url().includes("/quad/type") && response.status() === 400
    );
    expect(response.status()).toBe(400); // Check for a 400 status code
});

test("delete quad - no post first", async ({ page }) => {
    await page.route("**/quad/type", (route) =>
        route.continue()
    );

    await page.goto("https://trianglefrontend-production.up.railway.app/");
    await page.getByRole("button", { name: "Delete (DELETE)" }).click();

    const response = await page.waitForResponse((response) =>
        response.url().includes("/quad/type") && response.status() === 400
    );
    expect(response.status()).toBe(400); // Check for a 400 status code
});