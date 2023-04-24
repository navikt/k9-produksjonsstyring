import { getK9sakHref } from './paths';

describe('paths', () => {
	test('får riktig url til k9', () => {
		const fagsak = `https://app-q1.adeo.no/k9/web/fagsak/1DMU1B2/`;
		const k9SakUrl = 'https://app-q1.adeo.no/k9/web';
		const saksnummer = '1DMU1B2';
		const behandlingId = 1337;

		expect(getK9sakHref(k9SakUrl, saksnummer)).toEqual(fagsak);
		expect(getK9sakHref(k9SakUrl, saksnummer, behandlingId)).toContain(fagsak);
		expect(getK9sakHref(k9SakUrl, saksnummer, behandlingId)).toContain('punkt=default');
		expect(getK9sakHref(k9SakUrl, saksnummer, behandlingId)).toContain('fakta=default');
	});
});
