import Kodeverk from 'kodeverk/kodeverkTsType';

interface IPaaVentResponse {
  påVent: IBehandlingerSomGarAvVentType;
  påVentPerVenteårsak: IBehandlingerSomGarAvVentType;
}
interface IBehandlingerSomGarAvVentType {
  fagsakYtelseType: Kodeverk;
  behandlingType: Kodeverk;
  dato: string;
  antall: number;
  venteÅrsak?: string;
}

export { IPaaVentResponse, IBehandlingerSomGarAvVentType };
