type NavAnsatt = Readonly<{
  navn: string;
  brukernavn: string;
  brukerIdent: string;
  kanSaksbehandle: boolean;
  kanOppgavestyre: boolean;
  kanBehandleKode6: boolean;
  kanReservere: boolean;
  funksjonellTid: string;
  kanDrifte: boolean;
}>;

export default NavAnsatt;
