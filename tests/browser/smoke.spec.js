import { test, expect } from '@playwright/test';

test.describe('SiWIT End-to-End Smoke Tests', () => {
  test('should load application dashboard and render title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/SiWIT/);
    await expect(page.locator('#current-module-title')).toHaveText('Dashboard');
    await expect(page.locator('.brand-app-name')).toHaveText('SiWIT');
  });

  test('should navigate to Sinhala Unicode Inspector and decompose text', async ({ page }) => {
    await page.goto('/#inspector');
    await expect(page.locator('#current-module-title')).toHaveText('Sinhala Unicode Inspector');
    const input = page.locator('#inspector-input');
    await input.fill('ක්‍රමය');
    await expect(page.locator('#inspector-sequence-view')).toContainText('Cluster #1');
  });

  test('should switch between Dark and Light themes correctly', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');
    
    await page.click('#btn-theme-toggle');
    await expect(html).toHaveAttribute('data-theme', 'light');
    
    await page.click('#btn-theme-toggle');
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });
});

