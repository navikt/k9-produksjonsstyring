import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('http://localhost:8030');
});

test('Kan vise køer', async ({ page }) => {
	await page.getByRole('button', { name: 'Avdelingslederpanel' }).click();
	await page.getByRole('link', { name: 'Nye behandlingskøer' }).click();
	await page.waitForURL('http://localhost:8030/avdelingsleder?fane=behandlingskoerV2');
	await expect(page.url()).toBe('http://localhost:8030/avdelingsleder?fane=behandlingskoerV2');

	await page.getByRole('cell', { name: 'Beskrivende tittel' }).isVisible();
	await page.getByRole('cell', { name: 'Kø 1' }).isVisible();
	await page.getByRole('cell', { name: 'Kø 2' }).isVisible();
});

test('kan opprette ny kø', async ({ page }) => {
	await page.getByRole('button', { name: 'Avdelingslederpanel' }).click();
	await page.getByRole('link', { name: 'Nye behandlingskøer' }).click();
	await page.getByRole('button', { name: 'Opprett ny kø' }).click();
	await page.getByRole('textbox', { name: 'Navn' }).fill('te');
	await page.getByText(/Du må skrive minst 3 tegn/).isVisible();
	await page.getByRole('textbox', { name: 'Navn' }).fill('testkø');
	await page.getByRole('button', { name: 'Opprett kø' }).click();
});

test('kan redigere kø', async ({ page }) => {
	await page.getByRole('button', { name: 'Avdelingslederpanel' }).click();
	await page.getByRole('link', { name: 'Nye behandlingskøer' }).click();
	await page.getByRole('cell', { name: 'Beskrivende tittel' }).isVisible();
	await page.getByRole('cell', { name: 'Kø 1' }).isVisible();
	await page.getByRole('cell', { name: 'Kø 2' }).isVisible();

	await page
		.getByRole('row', { name: 'Beskrivende tittel 0 - - Vis mer' })
		.getByRole('button', { name: 'Vis mer' })
		.click();

	await page.getByText('godt forklart tekst om hva formålet med køen er');
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
			{ delay: 10 },
		);

	await page.getByLabel('Velg saksbehandlere').click();
	await page.getByText('Mangler gruppering').click();
	await page.getByText('Legg til saksbehandlere').click();

	await page.getByRole('button', { name: 'Lagre kø' }).isEnabled();
	await page.getByRole('button', { name: 'Lagre kø' }).click();
	await expect(page.getByText('Er du sikker på at du ønsker å lagre køen?')).toBeVisible();
	await page.getByRole('button', { name: 'Lagre kø' }).click();

	await page.getByText('Køen er nå lagret!');
	await page.getByRole('button', { name: 'Lukk' }).click();
});

test('tidligere lagret kø vises korrekt', async ({ page }) => {
	await page.goto('http://localhost:8030/avdelingsleder');
	await page.goto('http://localhost:8030/avdelingsleder');
	await page.getByRole('link', { name: 'Nye behandlingskøer' }).click();
	await page
		.getByRole('row', { name: 'Stians morokø 6 - 28.05.2023 08:57 Vis mer' })
		.getByRole('button', { name: 'Vis mer' })
		.click();
	await page.getByRole('button', { name: 'Endre filter for kø' }).click();

	// Timestamp
	await expect(page.getByText('01.06.2023')).toBeDefined();

	// Duration settes
	await expect(page.getByLabel('Antall dager')).toHaveValue('3');

	// aksjonspunkter settes
	await page.getByRole('button', { name: '5038 - Fastsett beregningsgrunnlag' }).click();
	await page.getByRole('button', { name: '5039 - Ny/endret SN (varig endring)' }).click();
	await page.getByRole('button', { name: '5046 - Fordel beregningsgrunnlag' }).click();
	await page.getByRole('button', { name: '5047 - Tidsbegrenset arbeidsforhold' }).click();
	await page.getByRole('button', { name: '5049 - Ny/endret SN (ny i arb.livet)' }).click();
	await page.getByRole('button', { name: '5052 - Aktiviteter' }).click();
	await page.getByRole('button', { name: '5058 - Beregningsfakta' }).click();
	await page.getByRole('button', { name: '5084 - Feilutbetaling' }).click();
	await page.getByRole('button', { name: '6014 - Overstyring beregningsaktivitet' }).click();
	await page.getByRole('button', { name: '6015 - Overstyring beregningsgrunnlag' }).click();
	// Predefinerte verdier settes
	await page.getByRole('button', { name: 'Pleiepenger sykt barn' }).click();
	await page.getByRole('button', { name: 'Omsorgspenger' }).click();

	// boolean settes
	await expect(page.getByLabel('Ja')).toBeChecked(); // See if ja is checked

	// fritekst settes
	await expect(page.getByLabel('Skriv fritekst')).toHaveValue('MB4P3'); // filled with MB4P3
});
