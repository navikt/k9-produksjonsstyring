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
    dato: dayjs().add(7, 'day'),
    venteårsak: 'VENTEÅRSAK1',
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
    dato: dayjs().add(5, 'day'),
    venteårsak: 'VENTEÅRSAK2',
    antall: 1,
  },
];

export default behandlingerSomGårAvVentÅrsaker;
