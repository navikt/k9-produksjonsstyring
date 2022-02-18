import dayjs from 'dayjs';

const behandlingerSomGårAvVentÅrsaker = [
  {
    fagsakYtelseType: {
      kode: 'OMP_MA',
      navn: 'Omsorgsdager: midlertidig alene',
      kodeverk: 'FAGSAK_YTELSE_TYPE',
    },
    behandlingType: {
      kode: 'BT-002',
      navn: 'Førstegangsbehandling',
      kodeverk: 'ae0034',
    },
    frist: dayjs().add(7, 'day'),
    venteårsak: { kode: 'AVV_DOK', navn: 'Avventer dokumentasjon' },
    antall: 1,
  },
  {
    fagsakYtelseType: {
      kode: 'OMP_MA',
      navn: 'Omsorgsdager: midlertidig alene',
      kodeverk: 'FAGSAK_YTELSE_TYPE',
    },
    behandlingType: {
      kode: 'BT-002',
      navn: 'Førstegangsbehandling',
      kodeverk: 'ae0034',
    },
    frist: dayjs().add(5, 'day'),
    venteårsak: { kode: 'ANNET_MANUELT', navn: 'Annen manuell venteårsak' },
    antall: 1,
  },
];

export default behandlingerSomGårAvVentÅrsaker;
