const alleOppgaverMock = [{
  fagsakYtelseType: { kode: 'OMP', navn: 'Omsorgspenger', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'BT-007', navn: 'Tilbakekreving', kodeverk: 'ae0203' }, tilBehandling: true, antall: 30,
}, {
  fagsakYtelseType: { kode: 'OMP', navn: 'Omsorgspenger', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'BT-007', navn: 'Tilbakekreving', kodeverk: 'ae0203' }, tilBehandling: false, antall: 1,
}, {
  fagsakYtelseType: { kode: 'PSB', navn: 'Pleiepenger sykt barn', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'BT-007', navn: 'Tilbakekreving', kodeverk: 'ae0203' }, tilBehandling: false, antall: 1,
}, {
  fagsakYtelseType: { kode: 'PSB', navn: 'Pleiepenger sykt barn', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'SAMTALEREFERAT', navn: 'Samtalereferat', kodeverk: 'PUNSJ_INNSENDING_TYPE' }, tilBehandling: true, antall: 14,
}, {
  fagsakYtelseType: { kode: 'OMP_KS', navn: 'Omsorgsdager: kronisk syk', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'BT-002', navn: 'Førstegangsbehandling', kodeverk: 'ae0034' }, tilBehandling: true, antall: 137,
}, {
  fagsakYtelseType: { kode: 'OMP', navn: 'Omsorgspenger', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'BT-004', navn: 'Revurdering', kodeverk: 'ae0028' }, tilBehandling: true, antall: 160,
}, {
  fagsakYtelseType: { kode: 'OMP', navn: 'Omsorgspenger', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'BT-002', navn: 'Førstegangsbehandling', kodeverk: 'ae0034' }, tilBehandling: true, antall: 460,
}, {
  fagsakYtelseType: { kode: 'PSB', navn: 'Pleiepenger sykt barn', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'BT-004', navn: 'Revurdering', kodeverk: 'ae0028' }, tilBehandling: true, antall: 418,
}, {
  fagsakYtelseType: { kode: 'PSB', navn: 'Pleiepenger sykt barn', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'SKRIV_TIL_OSS_SVAR', navn: 'Skriv til oss svar', kodeverk: 'PUNSJ_INNSENDING_TYPE' }, tilBehandling: true, antall: 4,
}, {
  fagsakYtelseType: { kode: 'OMP_AO', navn: 'Omsorgsdager: alene om omsorg', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'BT-004', navn: 'Revurdering', kodeverk: 'ae0028' }, tilBehandling: true, antall: 2,
}, {
  fagsakYtelseType: { kode: 'OMP_KS', navn: 'Omsorgsdager: kronisk syk', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'BT-004', navn: 'Revurdering', kodeverk: 'ae0028' }, tilBehandling: true, antall: 11,
}, {
  fagsakYtelseType: { kode: 'PSB', navn: 'Pleiepenger sykt barn', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'BT-007', navn: 'Tilbakekreving', kodeverk: 'ae0203' }, tilBehandling: true, antall: 12,
}, {
  fagsakYtelseType: { kode: 'OMP_KS', navn: 'Omsorgsdager: kronisk syk', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'BT-002', navn: 'Førstegangsbehandling', kodeverk: 'ae0034' }, tilBehandling: false, antall: 18,
}, {
  fagsakYtelseType: { kode: 'PSB', navn: 'Pleiepenger sykt barn', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'SKRIV_TIL_OSS_SPØRMSÅL', navn: 'Skriv til oss spørsmål', kodeverk: 'PUNSJ_INNSENDING_TYPE' }, tilBehandling: true, antall: 3,
}, {
  fagsakYtelseType: { kode: 'PSB', navn: 'Pleiepenger sykt barn', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'DIGITAL_ETTERSENDELSE', navn: 'Digital ettersendelse', kodeverk: 'PUNSJ_INNSENDING_TYPE' }, tilBehandling: true, antall: 69,
}, {
  fagsakYtelseType: { kode: 'OMP_KS', navn: 'Omsorgsdager: kronisk syk', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'BT-004', navn: 'Revurdering', kodeverk: 'ae0028' }, tilBehandling: false, antall: 2,
}, {
  fagsakYtelseType: { kode: 'OMP_AO', navn: 'Omsorgsdager: alene om omsorg', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'BT-002', navn: 'Førstegangsbehandling', kodeverk: 'ae0034' }, tilBehandling: false, antall: 3,
}, {
  fagsakYtelseType: { kode: 'PPN', navn: 'Pleiepenger i livets sluttfase', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'BT-002', navn: 'Førstegangsbehandling', kodeverk: 'ae0034' }, tilBehandling: true, antall: 11,
}, {
  fagsakYtelseType: { kode: 'OMP', navn: 'Omsorgspenger', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'BT-002', navn: 'Førstegangsbehandling', kodeverk: 'ae0034' }, tilBehandling: false, antall: 7,
}, {
  fagsakYtelseType: { kode: 'OMP_MA', navn: 'Omsorgsdager: midlertidig alene', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'BT-002', navn: 'Førstegangsbehandling', kodeverk: 'ae0034' }, tilBehandling: false, antall: 8,
}, {
  fagsakYtelseType: { kode: 'PSB', navn: 'Pleiepenger sykt barn', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'BT-004', navn: 'Revurdering', kodeverk: 'ae0028' }, tilBehandling: false, antall: 2,
}, {
  fagsakYtelseType: { kode: 'PSB', navn: 'Pleiepenger sykt barn', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'BT-002', navn: 'Førstegangsbehandling', kodeverk: 'ae0034' }, tilBehandling: false, antall: 26,
}, {
  fagsakYtelseType: { kode: 'OMP_MA', navn: 'Omsorgsdager: midlertidig alene', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'BT-002', navn: 'Førstegangsbehandling', kodeverk: 'ae0034' }, tilBehandling: true, antall: 59,
}, {
  fagsakYtelseType: { kode: 'OMP', navn: 'Omsorgspenger', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'BT-004', navn: 'Revurdering', kodeverk: 'ae0028' }, tilBehandling: false, antall: 4,
}, {
  fagsakYtelseType: { kode: 'PSB', navn: 'Pleiepenger sykt barn', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'BT-002', navn: 'Førstegangsbehandling', kodeverk: 'ae0034' }, tilBehandling: true, antall: 1520,
}, {
  fagsakYtelseType: { kode: 'OMP_AO', navn: 'Omsorgsdager: alene om omsorg', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'BT-002', navn: 'Førstegangsbehandling', kodeverk: 'ae0034' }, tilBehandling: true, antall: 54,
}, {
  fagsakYtelseType: { kode: 'PSB', navn: 'Pleiepenger sykt barn', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'PAPIRSØKNAD', navn: 'Papirsøknad', kodeverk: 'PUNSJ_INNSENDING_TYPE' }, tilBehandling: true, antall: 334,
}, {
  fagsakYtelseType: { kode: 'PSB', navn: 'Pleiepenger sykt barn', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'KOPI', navn: 'Kopi', kodeverk: 'PUNSJ_INNSENDING_TYPE' }, tilBehandling: true, antall: 46,
}, {
  fagsakYtelseType: { kode: 'OMP_MA', navn: 'Omsorgsdager: midlertidig alene', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'BT-004', navn: 'Revurdering', kodeverk: 'ae0028' }, tilBehandling: true, antall: 4,
}, {
  fagsakYtelseType: { kode: 'PSB', navn: 'Pleiepenger sykt barn', kodeverk: 'FAGSAK_YTELSE_TYPE' }, behandlingType: { kode: 'PAPIRINNTEKTSOPPLYSNINGER', navn: 'Papirinntektsopplysninger', kodeverk: 'PUNSJ_INNSENDING_TYPE' }, tilBehandling: true, antall: 1,
}];

export default alleOppgaverMock;
