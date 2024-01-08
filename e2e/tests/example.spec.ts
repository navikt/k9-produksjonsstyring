import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:8030/');
  await page.getByRole('button', { name: 'Avdelingslederpanel' }).click();
  await page.getByRole('link', { name: 'a11y-title Saksbehandlere' }).click();
  await page.getByLabel('Epost').click();
  await page.getByLabel('Epost').fill('saksbehandler@nav.no');
  await page.getByRole('button', { name: 'Legg til saksbehandler' }).click();
  await page.getByRole('link', { name: 'Nye behandlingskøer' }).click();
  await page.getByRole('button', { name: 'Legg til ny behandlingskø' }).click();
  await page.getByLabel('Kønavn').fill('testkø');
  await page.getByLabel('Kønavn').press('Enter');
  await page.getByLabel('Velg saksbehandlere').click();
  await page.getByLabel('Velg saksbehandlere').fill('saks');
  await page.getByText('saksbehandler@nav.no').click();
  await page.getByRole('button', { name: 'Legg til saksbehandlere' }).click();
  await page.getByLabel('Beskrivelse').click();
  await page.getByLabel('Beskrivelse').fill('aisjdfiasjdfiasdfjasidfj');
  await page.getByRole('button', { name: 'Lagre behandlingskø' }).click();
  await page.getByTestId('lagre-button-modal').click();
  await page.getByRole('button', { name: 'Lukk' }).click();
  // Expect a title "to contain" a substring.
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
