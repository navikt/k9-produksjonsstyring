import { test, expect } from '@playwright/test';

const saksnummer = process.env.SAKSNUMMER as string;
test('Kan søke opp sak', async ({ page }) => {
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
});
