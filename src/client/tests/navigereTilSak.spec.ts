import { test } from '@playwright/test';

test('Kan søke opp sak', async ({ page }) => {
	await page.goto('http://localhost:8030/');
	await page.getByLabel('Saksnummer, fødselsnummer/D-nummer eller journalpostID').click();
	await page.getByLabel('Saksnummer, fødselsnummer/D-nummer eller journalpostID').fill('1DN3Xio');
	await page.getByLabel('Saksnummer, fødselsnummer/D-nummer eller journalpostID').press('Enter');
	await page.getByText('Saksnummer, fødselsnummer/D-nummer eller journalpostIDSøk').click();

	await page
		.getByRole('row', { name: '1DN3Xio SPRUDLENDE ELV Pleiepenger sykt barn Utredes', exact: true })
		.getByRole('cell', { name: '1DN3Xio' });
});
