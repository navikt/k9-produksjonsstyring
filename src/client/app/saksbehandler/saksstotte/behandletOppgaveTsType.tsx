type BehandletOppgave = Readonly<{
    saksnummer: string;
    behandlingId: number;
    personnummer: string;
    navn: string;
    eksternId: string;
    journalpostId: string;
    system: string;
}>

export default BehandletOppgave;
