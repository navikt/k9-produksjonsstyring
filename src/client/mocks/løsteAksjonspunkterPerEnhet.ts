import OppgaveSystem from "../app/types/OppgaveSystem";

const dato = '2021-11-12';
const løsteAksjonspunkterPerEnhet = [
  {
    fagsakYtelseType: 'PSB',
    behandlendeEnhet: '9001',
    fagsystemType: OppgaveSystem.K9SAK,
    dato,
    antall: 10,
  },
  {
    fagsakYtelseType: 'OMP',
    behandlendeEnhet: '9001',
    fagsystemType: OppgaveSystem.K9SAK,
    dato,
    antall: 500,
  },
  {
    fagsakYtelseType: 'OMP',
    behandlendeEnhet: '1337',
    fagsystemType: OppgaveSystem.K9SAK,
    dato,
    antall: 10,
  },
  {
    fagsakYtelseType: 'OMP_KS',
    behandlendeEnhet: '1337',
    fagsystemType: OppgaveSystem.K9SAK,
    dato,
    antall: 120,
  },
  {
    fagsakYtelseType: 'PSB',
    behandlendeEnhet: '1337',
    fagsystemType: OppgaveSystem.PUNSJ,
    dato,
    antall: 11,
  },
];

export default løsteAksjonspunkterPerEnhet;
