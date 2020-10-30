type BehandletOppgave = Readonly<{
    saksnummer: string;
    behandlingId: number;
    personnummer: string;
    navn: string;
    eksternId: string;
    journalpostId: string;
}>

export default BehandletOppgave;
