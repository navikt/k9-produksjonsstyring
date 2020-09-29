import { Kodeverk } from 'kodeverk/kodeverkTsType';

type NyeOgFerdigstilteMedStonadstype = Readonly<{
    behandlingType: Kodeverk;
    fagsakYtelseType: Kodeverk;
    nye: number;
    ferdigstilte: number;
    dato: string;
}>

export default NyeOgFerdigstilteMedStonadstype;
