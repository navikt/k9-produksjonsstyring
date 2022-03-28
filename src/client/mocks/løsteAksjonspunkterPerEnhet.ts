import OppgaveSystem from '../app/types/OppgaveSystem';

const dato = '2021-11-12';
const løsteAksjonspunkterPerEnhet = [
  {
    fagsakYtelseType: 'PSB',
    behandlendeEnhet: 'UKJENT',
    fagsystemType: OppgaveSystem.K9SAK,
    dato,
    antall: 10,
  },
  {
    fagsakYtelseType: 'OMP',
    behandlendeEnhet: '4403 NAV ARBEID OG YTELSER OSLO',
    fagsystemType: OppgaveSystem.K9SAK,
    dato,
    antall: 500,
  },
  {
    fagsakYtelseType: 'OMP',
    behandlendeEnhet: '4410 NAV ARBEID OG YTELSER SØRLANDET',
    fagsystemType: OppgaveSystem.K9SAK,
    dato,
    antall: 10,
  },
  {
    fagsakYtelseType: 'OMP',
    behandlendeEnhet: '4415 NAV ARBEID OG YTELSER MOLDE',
    fagsystemType: OppgaveSystem.K9SAK,
    dato,
    antall: 1,
  },
  {
    fagsakYtelseType: 'OMP_KS',
    behandlendeEnhet: '4410 NAV ARBEID OG YTELSER SØRLANDET',
    fagsystemType: OppgaveSystem.K9SAK,
    dato,
    antall: 120,
  },
  {
    fagsakYtelseType: 'PSB',
    behandlendeEnhet: '4410 NAV ARBEID OG YTELSER SØRLANDET',
    fagsystemType: OppgaveSystem.PUNSJ,
    dato,
    antall: 11,
  },
];

export default løsteAksjonspunkterPerEnhet;
