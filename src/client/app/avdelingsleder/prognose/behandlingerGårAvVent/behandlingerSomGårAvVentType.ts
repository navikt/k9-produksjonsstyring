interface IPaaVentResponse {
	påVent: IBehandlingerSomGarAvVentType[];
	påVentMedVenteårsak: IBehandlingerSomGarAvVentType[];
}
interface IBehandlingerSomGarAvVentType {
	fagsakYtelseType: string;
	behandlingType: string;
	dato: string;
	antall: number;
	venteårsak?: string;
	frist?: string;
}

export { IPaaVentResponse, IBehandlingerSomGarAvVentType };
