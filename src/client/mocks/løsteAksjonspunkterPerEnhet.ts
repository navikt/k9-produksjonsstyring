const dato = '2021-11-12';
const løsteAksjonspunkterPerEnhet = [
  {
    fagsakYtelseType: {
      kode: 'PSB',
      kodeverk: '',
    },
    behandlingType: { kode: 'Revurdering', behandlingType: '' },
    enhet: 9001,
    dato,
    antall: 10,
  },
  {
    fagsakYtelseType: {
      kode: 'OMP',
      kodeverk: '',
    },
    behandlingType: { kode: 'Revurdering', behandlingType: '' },
    enhet: 9001,
    dato,
    antall: 10,
  },
  {
    fagsakYtelseType: {
      kode: 'OMP_KS',
      kodeverk: '',
    },
    enhet: 9001,

    behandlingType: { kode: 'Revurdering', behandlingType: '' },
    dato,
    antall: 10,
  },
  {
    fagsakYtelseType: {
      kode: 'OMP_AO',
      kodeverk: '',
    },
    enhet: 1337,
    behandlingType: { kode: 'Revurdering', behandlingType: '' },
    dato,
    antall: 10,
  },
  {
    fagsakYtelseType: {
      kode: 'OMP_MA',
      kodeverk: '',
    },
    enhet: 1337,
    behandlingType: { kode: 'Revurdering', behandlingType: '' },
    dato,
    antall: 10,
  },
  {
    fagsakYtelseType: {
      kode: 'PSB',
      kodeverk: '',
    },
    behandlingType: { kode: 'Revurdering', kodeverk: 'PUNSJ_INNSENDING_TYPE' },
    dato,
    enhet: 1337,
    antall: 10,
  },
];

export default løsteAksjonspunkterPerEnhet;
