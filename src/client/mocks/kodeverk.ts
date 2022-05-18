const kodeverk = {
  BehandlingType: [
    {
      kode: 'BT-002',
      navn: 'Førstegangsbehandling',
      kodeverk: 'ae0034',
    },
    {
      kode: 'BT-003',
      navn: 'Klage',
      kodeverk: 'ae0058',
    },
    {
      kode: 'BT-004',
      navn: 'Revurdering',
      kodeverk: 'ae0028',
    },
    {
      kode: 'BT-006',
      navn: 'Innsyn',
      kodeverk: 'ae0042',
    },
    {
      kode: 'BT-007',
      navn: 'Tilbakekreving',
      kodeverk: 'ae0203',
    },
    {
      kode: 'BT-008',
      navn: 'Anke',
      kodeverk: 'ae0046',
    },
    {
      kode: 'BT-009',
      navn: 'Tilbakekreving revurdering',
      kodeverk: 'BT-009',
    },
    {
      kode: 'BT-010',
      navn: 'Unntaksbehandling',
      kodeverk: 'N/A',
    },
    {
      kode: 'PAPIRSØKNAD',
      navn: 'Papirsøknad',
      kodeverk: 'PUNSJ_INNSENDING_TYPE',
    },
    {
      kode: 'PAPIRETTERSENDELSE',
      navn: 'Papirettersendelse',
      kodeverk: 'PUNSJ_INNSENDING_TYPE',
    },
    {
      kode: 'PAPIRINNTEKTSOPPLYSNINGER',
      navn: 'Papirinntektsopplysninger',
      kodeverk: 'PUNSJ_INNSENDING_TYPE',
    },
    {
      kode: 'DIGITAL_ETTERSENDELSE',
      navn: 'Digital ettersendelse',
      kodeverk: 'PUNSJ_INNSENDING_TYPE',
    },
    {
      kode: 'INNLOGGET_CHAT',
      navn: 'Innlogget chat',
      kodeverk: 'PUNSJ_INNSENDING_TYPE',
    },
    {
      kode: 'SKRIV_TIL_OSS_SPØRMSÅL',
      navn: 'Skriv til oss spørsmål',
      kodeverk: 'PUNSJ_INNSENDING_TYPE',
    },
    {
      kode: 'SKRIV_TIL_OSS_SVAR',
      navn: 'Skriv til oss svar',
      kodeverk: 'PUNSJ_INNSENDING_TYPE',
    },
    {
      kode: 'SAMTALEREFERAT',
      navn: 'Samtalereferat',
      kodeverk: 'PUNSJ_INNSENDING_TYPE',
    },
    {
      kode: 'KOPI',
      navn: 'Kopi',
      kodeverk: 'PUNSJ_INNSENDING_TYPE',
    },
    {
      kode: 'INNTEKTSMELDING_UTGÅTT',
      navn: 'Inntektsmeldinger uten søknad',
      kodeverk: 'PUNSJ_INNSENDING_TYPE',
    },
    {
      kode: 'UTEN_FNR_DNR',
      navn: 'Uten fnr eller dnr',
      kodeverk: 'PUNSJ_INNSENDING_TYPE',
    },
    {
      kode: 'UKJENT',
      navn: 'Ukjent',
      kodeverk: 'PUNSJ_INNSENDING_TYPE',
    },
  ],
  FagsakYtelseType: [
    {
      kode: 'PSB',
      navn: 'Pleiepenger sykt barn',
      kodeverk: 'FAGSAK_YTELSE_TYPE',
    },
    {
      kode: 'OMP',
      navn: 'Omsorgspenger',
      kodeverk: 'FAGSAK_YTELSE_TYPE',
    },
    {
      kode: 'OMD',
      navn: 'Omsorgsdager: overføring',
      kodeverk: 'FAGSAK_YTELSE_TYPE',
    },
    {
      kode: 'FRISINN',
      navn: 'Frisinn',
      kodeverk: 'FAGSAK_YTELSE_TYPE',
    },
    {
      kode: 'PPN',
      navn: 'Pleiepenger i livets sluttfase',
      kodeverk: 'FAGSAK_YTELSE_TYPE',
    },
    {
      kode: 'OLP',
      navn: 'OLP',
      kodeverk: 'FAGSAK_YTELSE_TYPE',
    },
    {
      kode: 'OMP_KS',
      navn: 'Omsorgsdager: kronisk syk',
      kodeverk: 'FAGSAK_YTELSE_TYPE',
    },
    {
      kode: 'OMP_MA',
      navn: 'Omsorgsdager: midlertidig alene',
      kodeverk: 'FAGSAK_YTELSE_TYPE',
    },
    {
      kode: 'OMP_AO',
      navn: 'Omsorgsdager: alene om omsorg',
      kodeverk: 'FAGSAK_YTELSE_TYPE',
    },
    {
      kode: 'UKJENT',
      navn: 'Ukjent',
      kodeverk: 'FAGSAK_YTELSE_TYPE',
    },
  ],
  KøSortering: [
    {
      kode: 'OPPRBEH',
      navn: 'Dato for opprettelse av behandling',
      felttype: 'DATO',
      feltkategori: '',
      kodeverk: 'KO_SORTERING',
    },
    {
      kode: 'FORSTONAD',
      navn: 'Dato for første stønadsdag',
      felttype: 'DATO',
      feltkategori: '',
      kodeverk: 'KO_SORTERING',
    },
  ],
  FagsakStatus: [
    {
      kode: 'OPPR',
      navn: 'Opprettet',
      kodeverk: 'FAGSAK_STATUS',
    },
    {
      kode: 'UBEH',
      navn: 'Under behandling',
      kodeverk: 'FAGSAK_STATUS',
    },
    {
      kode: 'LOP',
      navn: 'Løpende',
      kodeverk: 'FAGSAK_STATUS',
    },
    {
      kode: 'AVSLU',
      navn: 'Avsluttet',
      kodeverk: 'FAGSAK_STATUS',
    },
  ],
  AndreKriterierType: [
    {
      kode: 'FRA_PUNSJ',
      navn: 'Fra Punsj',
      kodeverk: 'ANDRE_KRITERIER_TYPE',
    },
    {
      kode: 'TIL_BESLUTTER',
      navn: 'Til beslutter',
      kodeverk: 'ANDRE_KRITERIER_TYPE',
    },
    {
      kode: 'AVKLAR_MEDLEMSKAP',
      navn: 'Avklar medlemskap',
      kodeverk: 'ANDRE_KRITERIER_TYPE',
    },
    {
      kode: 'AVKLAR_INNTEKTSMELDING_BEREGNING',
      navn: 'Avklar inntektsmeldng',
      kodeverk: 'ANDRE_KRITERIER_TYPE',
    },
    {
      kode: 'VENTER_PÅ_KOMPLETT_SØKNAD',
      navn: 'Venter på komplett søknad',
      kodeverk: 'ANDRE_KRITERIER_TYPE',
    },
    {
      kode: 'ENDELIG_BEH_AV_INNTEKTSMELDING',
      navn: 'Endelig beh av inntektsmelding',
      kodeverk: 'ANDRE_KRITERIER_TYPE',
    },
    {
      kode: 'VENTER_PÅ_ANNEN_PARTS_SAK',
      navn: 'Venter på annen parts sak',
      kodeverk: 'ANDRE_KRITERIER_TYPE',
    },
    {
      kode: 'FORLENGELSER_FRA_INFOTRYGD',
      navn: 'Forlengelser fra infotrygd',
      kodeverk: 'ANDRE_KRITERIER_TYPE',
    },
    {
      kode: 'FORLENGELSER_FRA_INFOTRYGD_AKSJONSPUNKT',
      navn: 'Forlengelser fra infotrygd aksjonspunkt',
      kodeverk: 'ANDRE_KRITERIER_TYPE',
    },
  ],
  BehandlingStatus: [
    {
      kode: 'AVSLU',
      navn: 'Avsluttet',
      kodeverk: 'BEHANDLING_TYPE',
    },
    {
      kode: 'FVED',
      navn: 'Fatter vedtak',
      kodeverk: 'BEHANDLING_TYPE',
    },
    {
      kode: 'IVED',
      navn: 'Iverksetter vedtak',
      kodeverk: 'BEHANDLING_TYPE',
    },
    {
      kode: 'OPPRE',
      navn: 'Opprettet',
      kodeverk: 'BEHANDLING_TYPE',
    },
    {
      kode: 'UTRED',
      navn: 'Utredes',
      kodeverk: 'BEHANDLING_TYPE',
    },
    {
      kode: 'VENT',
      navn: 'Satt på vent',
      kodeverk: 'BEHANDLING_TYPE',
    },
    {
      kode: 'LUKKET',
      navn: 'Lukket',
      kodeverk: 'BEHANDLING_TYPE',
    },
    {
      kode: 'SENDT_INN',
      navn: 'Sendt inn',
      kodeverk: 'BEHANDLING_TYPE',
    },
  ],
  Venteårsak: [
    {
      kode: "AVV_DOK",
      navn: "Avventer dokumentasjon",
      kodeverk: "VENTEÅRSAK_TYPE"
    },
    {
      kode: "VENT_MANGL_FUNKSJ_SAKSBEHANDLER",
      navn: "Manglende funksjonalitet i løsningen",
      kodeverk: "VENTEÅRSAK_TYPE"
    },
    {
      kode: "VENTER_SVAR_INTERNT",
      navn: "Meldt i Porten eller Teams",
      kodeverk: "VENTEÅRSAK_TYPE"
    },
    {
      kode: "AUTOMATISK_SATT_PA_VENT",
      navn: "Automatisk satt på vent",
      kodeverk: "VENTEÅRSAK_TYPE"
    },
    {
      kode: "UKJENT",
      navn: "Mangler venteårsak",
      kodeverk: "VENTEÅRSAK_TYPE"
    }
  ],
  KøKriterierType: [
    {
      kode: "FEILUTBETALING",
      navn: "Feilutbetalt beløp",
      felttype: "BELOP",
      kodeverk: "KØ_KRITERIER_TYPE"
    },
    {
      kode: "BEHANDLINGTYPE",
      navn: "Behandling type",
      felttype: "KODEVERK",
      felttypeKodeverk: "BehandlingType",
      kodeverk: "KØ_KRITERIER_TYPE"
    }
  ]
};

export default kodeverk;
