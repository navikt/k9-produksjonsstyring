enum BehandlingKoVersjon {
	V1 = 'v1',
	V2 = 'v2',
}

export const getKoId = (idMedVersjon: string) => {
	if (!idMedVersjon) return idMedVersjon;
	const id = idMedVersjon.split('__')[0];
	return id;
};

export const erKoV2 = (idMedVersjon: string) => {
	const versjon = idMedVersjon.split('__')[1];
	return versjon === BehandlingKoVersjon.V2;
};
