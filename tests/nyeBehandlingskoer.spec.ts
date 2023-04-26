import { expect, test } from '@playwright/test';

test('Kan vise køer', async ({ page }) => {
	await page.goto('http://localhost:8030');
	await page.getByRole('button', { name: 'Avdelingslederpanel' }).click();
	await page.getByRole('link', { name: 'Nye behandlingskøer' }).click();
	await expect(page.url()).toBe('http://localhost:8030/avdelingsleder?fane=behandlingskoerV2');

	await page.getByRole('cell', { name: 'Beskrivende tittel' }).isVisible();
	await page.getByRole('cell', { name: 'Kø 1' }).isVisible();
	await page.getByRole('cell', { name: 'Kø 2' }).isVisible();
});

test('kan opprette ny kø', async ({ page }) => {
	await page.goto('http://localhost:8030/avdelingsleder?fane=behandlingskoerV2');
	await page.getByRole('button', { name: 'Opprett ny kø' }).click();
	await page.getByRole('textbox', { name: 'Navn' }).fill('te');
	await page.getByText(/Du må skrive minst 3 tegn/).isVisible();
	await page.getByRole('textbox', { name: 'Navn' }).fill('testkø');
	await page.getByRole('button', { name: 'Opprett kø' }).click();
});
