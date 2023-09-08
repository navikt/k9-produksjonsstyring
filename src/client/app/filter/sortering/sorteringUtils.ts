export const mapKodeTilSorteringParams = (kode: string) => {
	switch (kode) {
		case 'mottattDatoEldstTilNyest':
			return {
				kode: 'mottattDato',
				økende: true,
			};
		case 'mottattDatoNyestTilEldst':
			return {
				kode: 'mottattDato',
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
