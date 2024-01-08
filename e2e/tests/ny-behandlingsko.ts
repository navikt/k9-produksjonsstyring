import { test,  } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:8030/');
  await page.getByRole('button', { name: 'Avdelingslederpanel' }).click();
  await page.getByRole('link', { name: 'Nye behandlingskøer' }).click();
  await page.getByRole('button', { name: 'Legg til ny behandlingskø' }).click();
  await page.getByLabel('Kønavn').fill('testkø');
  await page.getByLabel('Kønavn').press('Enter');
  await page.getByLabel('Velg saksbehandlere').click();
  await page.getByLabel('Velg saksbehandlere').fill('saks');
  await page.getByText('Saksbehandler Sara').click();
  await page.getByRole('button', { name: 'Legg til saksbehandlere' }).click();
  await page.getByLabel('Beskrivelse').click();
  await page.getByLabel('Beskrivelse').fill('aisjdfiasjdfiasdfjasidfj');
  await page.getByRole('button', { name: 'Lagre behandlingskø' }).click();
  await page.getByTestId('lagre-button-modal').click();
  await page.getByRole('button', { name: 'Lukk' }).click();
});
