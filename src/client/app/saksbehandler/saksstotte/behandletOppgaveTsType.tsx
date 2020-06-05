type BehandletOppgave = Readonly<{
    saksnummer: string;
    behandlingId: number;
    personnummer: string;
    navn: string;
    eksternId: string;
}>

export default BehandletOppgave;
