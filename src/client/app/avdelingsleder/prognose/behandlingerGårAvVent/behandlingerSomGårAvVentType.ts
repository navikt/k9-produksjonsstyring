interface IBehandlingerSomGarAvVentType {
	fagsakYtelseType: string;
	behandlingType: string;
	dato: string;
	antall: number;
	venteårsak?: string;
	frist?: string;
}
interface IPaaVentResponse {
	påVent: IBehandlingerSomGarAvVentType[];
	påVentMedVenteårsak: IBehandlingerSomGarAvVentType[];
}

export { IPaaVentResponse, IBehandlingerSomGarAvVentType };
