type Reservasjon = Readonly<{
	reservasjonsnøkkel: string
	reservertAvUid: string;
	reservertAvNavn: string;
	reservertTilTidspunkt: string;
	oppgaveId: string;
	saksnummer: string;
	behandlingType: string;
	tilBeslutter: boolean;
}>;

export default Reservasjon;
