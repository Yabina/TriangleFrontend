// @ts-check
import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://trianglefrontend-production.up.railway.app/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/TriangleFrontend/);
  await expect(page.getByText("MSSE640 Frontend Angular App")).toBeVisible();
   //await page.pause();
});

test("get equilateral", async ({ page }) => {
  await page.goto("https://trianglefrontend-production.up.railway.app/");
  await page.getByRole("spinbutton", { name: "Side 1" }).fill("3");
  await page.getByRole("spinbutton", { name: "Side 2" }).fill("3");
  await page.getByRole("spinbutton", { name: "Side 3" }).fill("3");
  await page.getByRole("button", { name: "Get Triangle Type" }).click();
  await expect(page.getByText("Type of Triangle: Equilateral")).toBeVisible();
  //await page.pause();
});

test("get scalene", async ({ page }) => {
  await page.goto("https://trianglefrontend-production.up.railway.app/");
  await page.getByRole("spinbutton", { name: "Side 1" }).click();
  await page.getByRole("spinbutton", { name: "Side 1" }).fill("4");
  await page.getByRole("spinbutton", { name: "Side 2" }).click();
  await page.getByRole("spinbutton", { name: "Side 2" }).fill("3");
  await page.getByRole("spinbutton", { name: "Side 3" }).click();
  await page.getByRole("spinbutton", { name: "Side 3" }).fill("5");
  await page.getByRole("button", { name: "Get Triangle Type" }).click();
  await expect(page.getByText("Type of Triangle: Scalene")).toBeVisible();
  // await page.pause();
});

test("get isosolies", async ({ page }) => {
  await page.goto("https://trianglefrontend-production.up.railway.app/");
  await page.getByRole('spinbutton', { name: 'Side 1' }).fill('3');
  await page.getByRole('spinbutton', { name: 'Side 2' }).fill('3');
  await page.getByRole('spinbutton', { name: 'Side 3' }).fill('5');
  await page.getByRole('button', { name: 'Get Triangle Type' }).click();
  await expect(page.getByText("Type of Triangle: Isosceles")).toBeVisible();
 // await page.pause();
});

test("has footer", async ({ page }) => {
  await page.goto("https://trianglefrontend-production.up.railway.app/");
  await page.getByText('© 2025 TriangleFrontend').click();
  await expect(page.getByText('© 2025 TriangleFrontend')).toBeVisible();
 //await page.pause();
});

test("has link", async ({ page }) => {
  await page.goto("https://trianglefrontend-production.up.railway.app/");
  await page.getByRole('link', { name: 'View on GitHub' }).click();
  await expect(page).toHaveURL(new RegExp("https://trianglefrontend-production.up.railway.app/"));
  await expect(page.getByText('TriangleFrontend')).toBeVisible();
 
 await page.pause();
});
