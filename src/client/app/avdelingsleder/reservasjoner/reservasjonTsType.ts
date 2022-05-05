type Reservasjon = Readonly<{
  reservertAvUid: string;
  reservertAvNavn: string;
  reservertTilTidspunkt: string;
  oppgaveId: string;
  saksnummer: string;
  behandlingType: string;
  tilBeslutter: boolean;
  begrunnelse: string;
}>

export default Reservasjon;
