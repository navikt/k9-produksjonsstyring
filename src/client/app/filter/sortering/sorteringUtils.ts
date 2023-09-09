export const mapKodeTilSorteringParams = (kode: string) => {
	switch (kode) {
		case 'mottattDatoEldstTilNyest':
			return {
				kode: 'mottattDato',
				område: 'K9',
				økende: true,
			};
		case 'mottattDatoNyestTilEldst':
			return {
				kode: 'mottattDato',
				område: 'K9',
				økende: false,
			};

		default:
			return null;
	}
};

export const mapSorteringParamsTilKode = ({ kode, økende }: { kode: string; økende: boolean }) => {
	switch (kode) {
		case 'mottattDato':
			return økende ? 'mottattDatoEldstTilNyest' : 'mottattDatoNyestTilEldst';
		default:
			return null;
	}
};
