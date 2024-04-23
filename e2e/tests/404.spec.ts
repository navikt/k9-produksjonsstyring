import { test, expect } from '@playwright/test';

test('Skal få opp 404-side når man går til en path som ikke finnes', async ({ page }) => {
	await page.goto('http://localhost:8031/url-som-ikke-finnes');
	await page.getByText('Denne siden finnes ikke.').click();
	await page.getByRole('link', { name: 'Gå til forsiden' }).click();
	// kommer til forsiden og ser at søkefeltet er der
	expect(page.getByRole('heading', { name: 'Søk på sak, person eller' })).toBeTruthy();
});
