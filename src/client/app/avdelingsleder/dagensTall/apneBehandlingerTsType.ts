import { Kodeverk } from 'kodeverk/kodeverkTsType';

type ApneBehandlinger = Readonly<{
    behandlingType: Kodeverk;
    antall:number;
}>

export default ApneBehandlinger;
