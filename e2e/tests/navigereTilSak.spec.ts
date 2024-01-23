import { test, expect } from '@playwright/test';

const saksnummer = '5YC1S' as string;
test('Kan søke opp og gå til sak', async ({ page }) => {
	await page.goto('/');
	const searchInput = page.getByLabel('Saksnummer, fødselsnummer/D-nummer eller journalpostID');
	await searchInput.click();
	await searchInput.fill(saksnummer);

	const searchButton = page.getByRole('button', { name: 'Søk' });
	await expect(searchButton).toBeEnabled();
	await searchButton.click();

	await page.waitForResponse((response) => response.url().includes('/api/fagsak/sok') && response.status() === 200);

	const searchResult = page.getByRole('cell', { name: saksnummer });
	await expect(searchResult).toBeVisible();

	expect(page.getByText('Ønsker du å reservere behandlingen?')).toBeVisible();
	await page.getByRole('button', { name: 'Ja' }).click();

	expect(page.url()).toBe(`https://k9.intern.nav.no/k9/web/fagsak/${saksnummer}/`);
});
