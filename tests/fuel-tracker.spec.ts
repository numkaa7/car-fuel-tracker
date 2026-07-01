import { test, expect, Page } from '@playwright/test';

test.describe('Car Fuel Tracker - Automated UI Tests (TypeScript)', () => {

  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('https://numkaa7.github.io/car-fuel-tracker/#');
  });

  test('TC-01: Successful Fuel Log Creation and Math Calculation', async ({ page }: { page: Page }) => {
    await page.click('#add-car-btn');
    await page.fill('#modal-brand', 'Skoda');
    await page.fill('#modal-model', 'Octavia');
    await page.fill('#modal-year', '2018');
    await page.fill('#modal-engine', '1.6');
    await page.selectOption('#modal-fuel', { label: 'Бензин' });
    await page.fill('#modal-oil-interval', '10000');
    await page.fill('#modal-filters-interval', '15000');
    await page.click('#modal-save');

    await page.selectOption('#car-selector', { label: 'Skoda Octavia (2018)' });
    await page.fill('#input-distance', '120000');
    await page.fill('#input-liters', '40');
    await page.fill('#input-price', '55');
    await page.click('.btn-submit');
    await expect(page.locator('#input-distance')).toHaveValue('');
    await expect(page.locator('#monthly-spent')).toHaveText('2200.00');
    await page.getByRole('link', { name: 'Історія', exact: true }).click();
    const history = page.locator('#history-list');
    await expect(history).toContainText('40');
  });

  test('TC-02: Prevent Empty Fields Form Submission', async ({ page }: { page: Page }) => {
    await page.fill('#input-distance', '120500');
    await page.fill('#input-price', '55');
    await page.click('.btn-submit');
    await expect(page.locator('#monthly-spent')).toHaveText('0.00');
  });

  test('TC-03: Form Validation - Prevent Creating Car with Empty Fields', async ({ page }: { page: Page }) => {
    await page.click('#add-car-btn');
    await page.click('#modal-save');
    const carDropdown = page.locator('#car-selector');
    await expect(carDropdown).not.toContainText('Skoda');
    await expect(page.locator('.modal-content h2')).toHaveText('Додати авто');
  });

  test('TC-04: UX Boundary Check - Handling Duplicate Car Names', async ({ page }: { page: Page }) => {
    await page.click('#add-car-btn');
    await page.fill('#modal-brand', 'Honda');
    await page.fill('#modal-model', 'Civic');
    await page.fill('#modal-year', '1998');
    await page.fill('#modal-engine', '1.6');
    await page.selectOption('#modal-fuel', { label: 'Бензин' });
    await page.fill('#modal-oil-interval', '10000');
    await page.fill('#modal-filters-interval', '15000');
    await page.click('#modal-save');

    await page.click('#add-car-btn');
    await page.fill('#modal-brand', 'Honda');
    await page.fill('#modal-model', 'Civic');
    await page.fill('#modal-year', '1998');
    await page.fill('#modal-engine', '1.6');
    await page.selectOption('#modal-fuel', { label: 'Бензин' });
    await page.fill('#modal-oil-interval', '10000');
    await page.fill('#modal-filters-interval', '15000');
    await page.click('#modal-save');

    const carOptions = page.locator('#car-selector option');
    await expect(carOptions).toHaveCount(4);
  });

  test('TC-06: Security & Data Integrity - Wipe All Data via Danger Zone', async ({ page }: { page: Page }) => {
    await page.click('#add-car-btn');
    await page.fill('#modal-brand', 'Skoda');
    await page.fill('#modal-model', 'Octavia');
    await page.fill('#modal-year', '2018');
    await page.fill('#modal-engine', '1.6');
    await page.selectOption('#modal-fuel', { label: 'Бензин' });
    await page.fill('#modal-oil-interval', '10000');
    await page.fill('#modal-filters-interval', '15000');
    await page.click('#modal-save');

    await page.selectOption('#car-selector', { label: 'Skoda Octavia (2018)' });
    await page.fill('#input-distance', '120000');
    await page.fill('#input-liters', '40');
    await page.fill('#input-price', '55');
    await page.click('.btn-submit');

    await page.getByRole('link', { name: 'Налаштування', exact: true }).click();

    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('ВСІ');
      await dialog.accept();
    });

    await page.click('#clear-data-btn');

    await page.getByRole('link', { name: 'Dashboard', exact: true }).click();
    await expect(page.locator('#monthly-spent')).toHaveText('0.00');
    await expect(page.locator('#car-selector')).not.toContainText('Skoda Octavia (2018)');
  });
});