export enum SORTERING_ALTERNATIVER {
	mottattDatoEldstTilNyest = 'mottattDatoEldstTilNyest',
	mottattDatoNyestTilEldst = 'mottattDatoNyestTilEldst',
	feilutbetaltBeløpSynkende = 'feilutbetaltBeløpSynkende',
	feilutbetalingsdatoEldstTilNyest = 'feilutbetalingsdatoSynkende',
}

const koder = {
	mottattDato: 'mottattDato',
	førsteFeilutbetalingDato: 'førsteFeilutbetalingDato',
	feilutbetaltBeløp: 'feilutbetaltBeløp',
};
export const mapKodeTilSorteringParams = (kode: SORTERING_ALTERNATIVER) => {
	switch (kode) {
		case SORTERING_ALTERNATIVER.mottattDatoEldstTilNyest:
			return {
				kode: 'mottattDato',
				område: 'K9',
				økende: true,
			};
		case SORTERING_ALTERNATIVER.mottattDatoNyestTilEldst:
			return {
				kode: 'mottattDato',
				område: 'K9',
				økende: false,
			};
		case SORTERING_ALTERNATIVER.feilutbetaltBeløpSynkende:
			return {
				kode: 'feilutbetaltBeløp',
				område: 'K9',
				økende: false,
			};
		case SORTERING_ALTERNATIVER.feilutbetalingsdatoEldstTilNyest:
			return {
				kode: 'førsteFeilutbetalingDato',
				område: 'K9',
				økende: true,
			};

		default:
			return null;
	}
};

export const mapSorteringParamsTilKode = ({ kode, økende }: { kode: string; økende: boolean }) => {
	switch (kode) {
		case koder.mottattDato:
			return økende ? 'mottattDatoEldstTilNyest' : 'mottattDatoNyestTilEldst';
		case koder.førsteFeilutbetalingDato:
			return SORTERING_ALTERNATIVER.feilutbetalingsdatoEldstTilNyest;
		case koder.feilutbetaltBeløp:
			return SORTERING_ALTERNATIVER.feilutbetaltBeløpSynkende;
		default:
			return null;
	}
};
