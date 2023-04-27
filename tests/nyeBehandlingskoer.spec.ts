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

test('kan redigere kø', async ({ page }) => {
	await page.goto('http://localhost:8030/');
	await page.getByRole('button', { name: 'Avdelingslederpanel' }).click();
	await page.getByRole('link', { name: 'Nye behandlingskøer' }).click();
	const køer = await page.getByRole('button', { name: 'Vis mer' }).all();

	await køer[0].click();
	await page.getByLabel('Beskrivelse').fill('');
	// trykk lagre og se at det kommer opp feilmelding
	await page.getByRole('button', { name: 'Lagre' }).click();
	await page.getByText('Feltet er påkrevd');

	await page
		.getByLabel('Beskrivelse')
		.type(
			'En kø i et saksbehandlingssystem for pleiepenger er en samling av ting som folk' +
				'\nhar sendt inn, og de er lagt i en lang rekkefølge. De venter på å bli sett på av' +
				'\nnoen som jobber der. Noen av tingene blir godkjent, og noen blir ikke godkjent.' +
				'\nDette skjer i et dataprogram som hjelper folk å holde styr på alt.',
			{ delay: 50 },
		);

	await page.getByText('Du har gjort endringer i køen. Husk å lagre endringene før du lukker vinduet.');
	await page.getByRole('button', { name: 'Lagre kø' }).isEnabled();
	await page.getByRole('button', { name: 'Lagre kø' }).click();
	// select second lagre kø button
	const butts = await page.getByRole('button', { name: 'Lagre kø' }).all();

	butts[1].click();
	await page.getByText('Køen er nå lagret!');
	await page.getByRole('button', { name: 'Lukk' }).click();
});
