import { test, expect } from '@playwright/test';

const lagNyoppgavekø = async (page: any, kønavn: string) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Avdelingslederpanel' }).click();
	await page.getByRole('link', { name: 'Nye oppgavekøer' }).click();
	await page.getByRole('button', { name: 'Legg til ny oppgavekø' }).click();
	await page.getByLabel('Kønavn').fill(kønavn);
	await page.getByLabel('Kønavn').press('Enter');
	await page.getByLabel('Velg saksbehandlere').click();
	await page.getByLabel('Velg saksbehandlere').fill('saks');
	await page.getByLabel('Saksbehandler Sara').click();
	await page.getByRole('button', { name: 'Legg til saksbehandlere' }).click();
	await page.getByLabel('Beskrivelse').click();
	await page.getByLabel('Beskrivelse').fill('aisjdfiasjdfiasdfjasidfj');
	await page.getByRole('button', { name: 'Lagre oppgavekø' }).click();
	await page.getByTestId('lagre-button-modal').click();
	await page.getByRole('button', { name: 'Lukk' }).click();
};

function formatDate(date: Date): string {
	return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(
		2,
		'0',
	)}.${date.getFullYear()}`;
}

const saksnummer = process.env.SAKSNUMMER as string;

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test('Kan søke opp og reservere opppgave', async ({ page }) => {
	const searchInput = page.getByLabel('Saksnummer, fødselsnummer/D-nummer eller journalpostID');
	await searchInput.click();
	await searchInput.fill(saksnummer);

	const searchButton = page.getByRole('button', { name: 'Søk' });
	await expect(searchButton).toBeEnabled();
	await searchButton.click();

	await page.waitForResponse((response) => response.url().includes('/api/fagsak/sok') && response.status() === 200);

	const searchResult = page.getByRole('cell', { name: saksnummer });
	await expect(searchResult).toBeVisible();
	await searchResult.click();

	expect(page.getByText('Ønsker du å reservere oppgaven?')).toBeVisible();
	await page.getByRole('button', { name: 'Ja' }).click();

	await page.waitForResponse(
		(response) => response.url().includes('/api/saksbehandler/oppgaver/reserver') && response.status() === 200,
	);
});

test('kan legge tilbake reservasjon i felles kø', async ({ page }) => {
	await expect(page.getByRole('cell', { name: saksnummer })).toBeVisible();
	await page.getByRole('img', { name: 'Handlinger på oppgave' }).click();
	await page.getByRole('button', { name: 'Legg oppgave tilbake i felles kø' }).click();
	await page.getByLabel('Når en reservert sak frigjøres er begrunnelse obligatorisk').fill('Dette er en god grunn');
	await page.getByRole('button', { name: 'OK' }).click();

	await expect(page.getByRole('cell', { name: saksnummer })).not.toBeVisible();
});

test('kan plukke oppgave fra kø og reservere', async ({ page }) => {
	const kønavn = 'bra kø';
	await lagNyoppgavekø(page, kønavn);
	await page.goto('/');
	await page.getByLabel('Velg oppgavekø').selectOption(kønavn);
	await page.getByRole('button', { name: 'Gi meg neste oppgave i køen' }).click();
	await page.waitForResponse(
		(response) => response.url().includes('/api/saksbehandler/oppgaver/reserver') && response.status() === 200,
	);
});

test('kan forlenge reservasjon', async ({ page }) => {
	await page.getByRole('row', { name: saksnummer }).getByRole('img', { name: 'Handlinger på oppgave' }).click();
	const today = new Date();
	const todayFormatted = formatDate(today);

	await page.getByRole('cell', { name: `Reservert til ${todayFormatted}` }).isVisible();
	await page.getByRole('button', { name: 'Forleng din reservasjon av oppgaven med 24 timer' }).click();

	const tomorrow = formatDate(new Date(today.getDate() + 1));
	await page.getByRole('cell', { name: `Reservert til ${tomorrow}` }).isVisible();
});

test('kan endre/og flytte reservasjon reservasjon', async ({ page }) => {
	await page.getByRole('row', { name: saksnummer }).getByRole('img').click();
	await page.getByRole('button', { name: 'Endre og/eller flytte' }).click();
	await page.getByLabel('Saksbehandlers navn').click();
	await page.getByLabel('Saksbehandlers navn').fill('Sara');
	await page.getByLabel('Endre og/eller flytte').getByRole('button', { name: 'Søk' }).click();
	// Get a date one week from now
	const date = new Date();
	date.setDate(date.getDate() + 7);

	// Format the date as dd.mm.yyyy
	const oneWeekFromNow = formatDate(date);
	// fill with date one week in the future dd.mm.yyyy this format
	await page.getByLabel(/^Velg dato som reservasjonen avsluttes \(Valgfritt å fylle ut\)$/).fill(oneWeekFromNow);
	await page.getByLabel('Begrunn endring av reservasjon').click();
	await page
		.getByLabel('Begrunn endring av reservasjon')
		.fill('jeg ønsker å ha denne oppgaven liggende på min benk skikkelig lenge ');
	await page.getByRole('button', { name: 'OK' }).click();
	await page.getByRole('cell', { name: `Reservert til ${oneWeekFromNow}` }).isVisible();
});
test('kan endre reservasjon som avdelingsleder', async ({ page }) => {
	await page.goto('/avdelingsleder');
	await page.getByRole('link', { name: 'Reservasjoner' }).click();
	await page.getByRole('row', { name: saksnummer }).getByRole('cell').nth(0).click();
	await page.getByRole('button', { name: 'Flytt reservasjonen til annen saksbehandler' }).click();
	await page.getByLabel('Saksbehandlers navn').click();
	await page.getByLabel('Saksbehandlers navn').fill('Sara');
	await page.getByLabel('Endre og/eller flytte').getByRole('button', { name: 'Søk' }).click();
	// Get a date two weeks from now
	const date = new Date();
	date.setDate(date.getDate() + 14);

	const twoWeeksFromNow = formatDate(date);
	await page.getByLabel(/^Velg dato som reservasjonen avsluttes \(Valgfritt å fylle ut\)$/).fill(twoWeeksFromNow);
	await page.getByLabel('Begrunn endring av reservasjon').click();
	await page
		.getByLabel('Begrunn endring av reservasjon')
		.fill('jeg ønsker å ha denne oppgaven liggende på min benk skikkelig lenge ');
	await page.getByRole('button', { name: 'OK' }).click();
	await page.getByRole('cell', { name: `Reservert til ${twoWeeksFromNow}` }).isVisible();
});

test('kan fjerne reservasjon som avdelingsleder', async ({ page }) => {
	await page.goto('/avdelingsleder');
	await page.getByRole('link', { name: 'Reservasjoner' }).click();
	await page.getByRole('row', { name: saksnummer }).getByRole('cell').nth(0).click();
	await page.getByRole('button', { name: 'Legg oppgave tilbake i felles kø' }).click();
	await page.getByLabel('Når en reservert sak frigjøres er begrunnelse obligatorisk').fill('Dette er en god grunn');
	await page.getByRole('button', { name: 'OK' }).click();

	await page.waitForResponse(
		(response) => response.url().includes('/api/saksbehandler/oppgaver/opphev') && response.status() === 200,
	);
	await page.waitForResponse(
		(response) => response.url().includes('/api/avdelingsleder/reservasjoner') && response.status() === 200,
	);

	await expect(page.getByRole('row', { name: saksnummer })).not.toBeVisible();
});
