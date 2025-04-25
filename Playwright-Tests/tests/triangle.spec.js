// @ts-check
import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://trianglefrontend-production.up.railway.app/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/TriangleFrontend/);
});

test("test 2", async ({ page }) => {
  await page.goto("https://trianglefrontend-production.up.railway.app/");

  await page.getByRole("spinbutton", { name: "Side 1" }).click();
  await page.getByRole("spinbutton", { name: "Side 1" }).fill("3");
  await page.getByRole("spinbutton", { name: "Side 2" }).click();
  await page.getByRole("spinbutton", { name: "Side 2" }).fill("3");
  await page.getByRole("spinbutton", { name: "Side 3" }).click();
  await page.getByRole("spinbutton", { name: "Side 3" }).fill("3");
  await page.getByRole("button", { name: "Get Triangle Type" }).click();
  await expect(page.locator("*")).toContainText(
    "Type of Triangle: Equilateral"
  );
  //await page.pause();
  // Expect a title "to contain" a substring.
});
// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
