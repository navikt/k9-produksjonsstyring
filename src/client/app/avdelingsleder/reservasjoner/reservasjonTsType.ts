type Reservasjon = Readonly<{
  reservertAvUid: string;
  reservertAvNavn: string;
  reservertTilTidspunkt: string;
  oppgaveId: string;
  saksnummer: string;
  behandlingType: string;
}>

export default Reservasjon;
