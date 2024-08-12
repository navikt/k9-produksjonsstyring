import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Avdelingslederpanel' }).click();
	await page.getByRole('link', { name: 'Nye oppgavekøer' }).click();
});
test('Kan lage ny oppgavekø', async ({ page }) => {
	await page.getByRole('button', { name: 'Legg til ny oppgavekø' }).click();
	await page.getByLabel('Kønavn').fill('Beskrivende tittel');
	await page.getByLabel('Kønavn').press('Enter');
	await page.getByLabel('Velg saksbehandlere').click();
	await page.getByLabel('Velg saksbehandlere').fill('saks');
	await page.getByLabel('Saksbehandler Sara').click();
	await page.getByRole('button', { name: 'Legg til saksbehandlere' }).click();
	await page.getByLabel('Beskrivelse').click();
	await page.getByLabel('Beskrivelse').fill('aisjdfiasjdfiasdfjasidfj');
	await page.getByRole('button', { name: 'Lagre oppgavekø' }).click();
	await page.getByRole('button', { name: 'Lukk' }).click();
});

test('kan redigere kø', async ({ page }) => {
	await page.getByRole('cell', { name: 'Beskrivende tittel' }).isVisible();

	await page
		.getByRole('row', { name: /Beskrivende tittel/i })
		.getByRole('button', { name: 'Vis mer' })
		.click();

	await page.getByLabel('Beskrivelse').fill('');
	// trykk lagre og se at det kommer opp feilmelding
	await page.getByRole('button', { name: 'Lagre oppgavekø' }).click();
	await page.getByText('Feltet er påkrevd').isVisible();

	await page
		.getByLabel('Beskrivelse')
		.fill(
			'En kø i et saksbehandlingssystem for pleiepenger er en samling av ting som folk' +
				'\nhar sendt inn, og de er lagt i en lang rekkefølge. De venter på å bli sett på av' +
				'\nnoen som jobber der. Noen av tingene blir godkjent, og noen blir ikke godkjent.' +
				'\nDette skjer i et dataprogram som hjelper folk å holde styr på alt.',
		);

	await page.getByRole('button', { name: 'Lagre oppgavekø' }).isEnabled();
	await page.getByRole('button', { name: 'Lagre oppgavekø' }).click();

	await page.getByRole('button', { name: 'Endre kriterier' }).click();

	// Legg til Duration
	await page.getByRole('button', { name: 'Legg til nytt kriterie' }).click();

	await page.getByLabel('Velg kriterie:').click();
	await page.getByRole('option', { name: 'Hittil akkumulert ventetid på annet for denne oppgaven' }).click();
	await page.getByRole('button', { name: 'Legg til', exact: true }).click();
	await page.getByPlaceholder('Antall dager').fill('3');

	// Legg til duration
	await page.getByRole('button', { name: 'Legg til nytt kriterie' }).click();
	await page.getByLabel('Velg kriterie:').click();
	await page.getByRole('option', { name: 'Registrert dato' }).click();
	await page.getByRole('button', { name: 'Legg til', exact: true }).click();
	await page.locator('#registrertDato-operator').selectOption('INTERVAL');
	await page.getByLabel('Fra').fill('01.01.2024');
	await page.getByLabel('Til', { exact: true }).fill('06.01.2024');

	// Legg til aksjonspunkt
	await page.getByRole('button', { name: 'Legg til nytt kriterie' }).click();
	await page.getByLabel('Velg kriterie:').click();
	await page.getByRole('option', { name: 'Løsbart aksjonspunkt' }).click();
	await page.getByRole('button', { name: 'Legg til', exact: true }).click();
	await page.getByLabel('Løsbart aksjonspunkt').click();
	await page.getByText('Beregning').click();
	await page.getByRole('button', { name: 'Legg til løsbart aksjonspunkt' }).click();
	await page.getByRole('button', { name: 'Legg til nytt kriterie' }).click();
	await page.getByLabel('Velg kriterie:').click();
	await page.getByRole('option', { name: 'Behandlingstype' }).click();
	await page.getByRole('button', { name: 'Legg til', exact: true }).click();
	await page.getByLabel('Behandlingstype').click();
	await page.getByText('Førstegangsbehandling').click();
	await page.getByRole('option', { name: 'Innsyn' }).click();
	await page.getByText('Inntektsmeldinger uten søknad').click();
	await page.getByRole('button', { name: 'Legg til nytt kriterie' }).click();

	// Legg til boolean
	await page.getByLabel('Velg kriterie:').click();
	await page.getByRole('option', { name: 'Søknad om nye perioder' }).click();
	await page.getByRole('button', { name: 'Legg til', exact: true }).click();
	await page.getByLabel('Ja', { exact: true }).check();

	// Legg til anvarlig saksbehandler
	await page.getByRole('button', { name: 'Legg til nytt kriterie' }).click();
	await page.getByText('Avanserte valg').click();
	await page.getByLabel('Velg kriterie:').click();
	await page.getByRole('option', { name: 'Ansvarlig saksbehandler' }).click();
	await page.getByRole('button', { name: 'Legg til', exact: true }).click();
	await page.getByLabel('Skriv fritekst').click();
	await page.getByLabel('Skriv fritekst').fill('M13337');

	// Lagre
	await page.getByRole('button', { name: 'Lagre', exact: true }).click();
	page.getByText('Køen er nå lagret!');
	await page.getByRole('button', { name: 'Lukk' }).click();
});

test('tidligere lagret kø vises korrekt', async ({ page }) => {
	await page.getByRole('row', { name: 'Beskrivende tittel' }).getByRole('button', { name: 'Vis mer' }).click();
	await page.getByRole('button', { name: 'Endre kriterier' }).click();

	// Timestamp
	page.getByText('01.06.2023').isVisible();

	// Duration settes
	await expect(page.getByLabel('Antall dager')).toHaveValue('3');

	// aksjonspunkter settes
	await page.getByRole('button', { name: '5038 - Fastsett beregningsgrunnlag' }).isVisible();
	await page.getByRole('button', { name: '5039 - Ny/endret SN (varig endring)' }).isVisible();
	await page.getByRole('button', { name: '5046 - Fordel beregningsgrunnlag' }).isVisible();
	await page.getByRole('button', { name: '5047 - Tidsbegrenset arbeidsforhold' }).isVisible();
	await page.getByRole('button', { name: '5049 - Ny/endret SN (ny i arb.livet)' }).isVisible();
	await page.getByRole('button', { name: '5052 - Aktiviteter' }).isVisible();
	await page.getByRole('button', { name: '5058 - Beregningsfakta' }).isVisible();
	await page.getByRole('button', { name: '5084 - Feilutbetaling' }).isVisible();
	await page.getByRole('button', { name: '6014 - Overstyring beregningsaktivitet' }).isVisible();
	await page.getByRole('button', { name: '6015 - Overstyring beregningsgrunnlag' }).isVisible();
	// Predefinerte verdier settes
	await page.getByRole('button', { name: 'Førstegangsbehandling' }).isVisible();
	await page.getByRole('button', { name: 'Innsyn' }).isVisible();

	// boolean settes
	await expect(page.getByLabel('Ja', { exact: true })).toBeChecked(); // See if ja is checked

	// fritekst settes
	await expect(page.getByLabel('Skriv fritekst')).toHaveValue('M13337');
});

test('kan slette kø', async ({ page }) => {
	await page.getByRole('row', { name: 'Beskrivende tittel' }).getByRole('button', { name: 'Slett' }).click();
	await page.getByText('Er du sikker på at du vil slette Beskrivende tittel?').isVisible();
	await page.getByRole('dialog').getByRole('button', { name: 'Slett' }).click();
	// assert at køen er borte
	await expect(page.getByRole('row', { name: 'Beskrivende tittel' })).not.toBeVisible();
});
