import { test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('http://localhost:8030/filter');
});

// TODO: Felt, #textField-rm er antageligvis ikke stabile nok til å bruke for å lokalisere elementer i testene over tid

test('kan legge til aksjonspunkt', async ({ page }) => {
	await page.getByRole('button', { name: 'Legg til filter' }).click();
	await page.getByLabel('Feltget').selectOption('K9__aksjonspunkt');
	await page.getByText('Velg aksjonspunkt').click();
	await page.getByLabel('Beregning').check();
	await page.getByRole('button', { name: 'Legg til aksjonspunkt' }).click();
	await page.getByRole('button', { name: 'Fjern alle' }).click();
});

test('kan legge til verdier som er predefinerte', async ({ page }) => {
	await page.getByRole('button', { name: 'Legg til filter' }).click();
	await page.getByLabel('Felt').selectOption('K9__fagsystem');
	await page.getByLabel('Velg fagsystem').click();
	await page.locator('label').filter({ hasText: 'K9-punsj' }).click();
	await page.getByRole('button', { name: 'Legg til fagsystem' }).click();
});
test('kan legge til verdier fra fritekst', async ({ page }) => {
	await page.getByRole('button', { name: 'Legg til filter' }).click();
	await page.getByLabel('Felt').selectOption('K9__saksnummer');
	await page.getByLabel('Skriv fritekst').click();
	await page.getByLabel('Skriv fritekst').fill('D4AILY');
});

test('kan legge til verdier med boolean', async ({ page }) => {
	await page.getByRole('button', { name: 'Legg til filter' }).click();
	await page.getByLabel('Felt').selectOption('K9__avventerTekniskFeil');
	await page.getByLabel('Ja').check();
});

test('can add date values', async ({ page }) => {
	await page.getByRole('button', { name: 'Legg til filter' }).click();
	await page.getByLabel('Felt').selectOption('K9__mottattDato');
	await page.getByLabel('Velg dato', { exact: true }).click();
	await page.getByLabel('Velg dato', { exact: true }).fill('01.01.2023');
});

test('kan legge til verdier med tall', async ({ page }) => {
	await page.getByRole('button', { name: 'Legg til filter' }).click();
	await page.getByLabel('Felt').selectOption('K9__akkumulertVentetidSaksbehandlerForTidligereVersjoner');
	await page.getByText('dager').isVisible();
	await page.getByPlaceholder('Antall dager').click();
	await page.getByPlaceholder('Antall dager').fill('10');
});

test('kan legge til grupper hvor minimum en av filterene må være oppfylt', async ({ page }) => {
	await page.getByRole('button', { name: 'Legg til gruppe av filtere' }).click();
	await page
		.locator('div')
		.filter({ hasText: /^Minimum en av disse må gjelde for oppgavenLegg til filterLegg til gruppe av filtere$/ })
		.getByRole('button', { name: 'Legg til gruppe av filtere' })
		.click();
	await page
		.locator('div')
		.filter({ hasText: /^Alle disse må gjelde for oppgavenLegg til filterLegg til gruppe av filtere$/ })
		.getByRole('button', { name: 'Legg til filter' })
		.click();
	await page.locator('#textField-ro').selectOption('K9__ansvarligBeslutter');
	await page.locator('#textField-rs').click();
	await page.locator('#textField-rs').fill('M166412');
	await page.getByRole('button', { name: 'Legg til filter' }).first().click();
	await page.locator('#textField-ru').selectOption('K9__ansvarligSaksbehandler');
	await page.locator('#textField-r12').click();
	await page.locator('#textField-r12').fill('M634021');
	await page.getByRole('button', { name: 'Legg til filter' }).nth(1).click();
	await page.locator('#textField-r14').selectOption('K9__avventerAnnet');
	await page.getByLabel('Ja').check();
});

test('kan legge til filter, hvilke felter som skal vises og sortering', async ({ page }) => {
	await page.getByRole('button', { name: 'Legg til filter' }).click();
	await page.getByLabel('Felt').selectOption('K9__akkumulertVentetidAnnetForTidligereVersjoner');
	await page.getByPlaceholder('Antall dager').click();
	await page.getByPlaceholder('Antall dager').fill('1');
	await page.getByRole('button', { name: 'Velg felter som skal vises' }).click();
	await page.getByRole('button', { name: 'Legg til felt' }).click();
	await page
		.getByRole('combobox', { name: 'Velg felt' })
		.selectOption('K9__akkumulertVentetidAnnetForTidligereVersjoner');
	await page.getByRole('button', { name: 'Velg sortering' }).click();
	await page
		.locator('div')
		.filter({ hasText: /^Velg sorteringLegg til felt$/ })
		.getByRole('button', { name: 'Legg til felt' })
		.click();
	await page.locator('#textField-rq').selectOption('K9__akkumulertVentetidAnnetForTidligereVersjoner');
});
