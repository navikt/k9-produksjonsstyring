import OppgaveSystem from "../app/types/OppgaveSystem";

const dato = '2021-11-12';
const løsteAksjonspunkterPerEnhet = [
  {
    fagsakYtelseType: 'PSB',
    behandlingType: 'Revurdering',
    behandlendeEnhet: '9001',
    fagsystemType: OppgaveSystem.K9SAK,
    dato,
    antall: 10,
  },
  {
    fagsakYtelseType: 'OMP',
    behandlingType: 'Revurdering',
    behandlendeEnhet: '9001',
    fagsystemType: OppgaveSystem.K9SAK,
    dato,
    antall: 500,
  },
  {
    fagsakYtelseType: 'OMP',
    behandlingType: 'Revurdering',
    behandlendeEnhet: '1337',
    fagsystemType: OppgaveSystem.K9SAK,
    dato,
    antall: 10,
  },
  {
    fagsakYtelseType: 'OMP_KS',
    behandlingType: 'Revurdering',
    behandlendeEnhet: '1337',
    fagsystemType: OppgaveSystem.K9SAK,
    dato,
    antall: 10,
  },
  {
    fagsakYtelseType: 'OMP_MA',
    behandlingType: 'Revurdering',
    behandlendeEnhet: '1337',
    fagsystemType: OppgaveSystem.K9SAK,
    dato,
    antall: 10,
  },
  {
    fagsakYtelseType: 'OMP_KS',
    behandlingType: 'Revurdering',
    behandlendeEnhet: '1337',
    fagsystemType: OppgaveSystem.K9SAK,
    dato,
    antall: 120,
  },
  {
    fagsakYtelseType: 'OMP_KS',
    behandlingType: 'Revurdering',
    behandlendeEnhet: '1337',
    fagsystemType: OppgaveSystem.PUNSJ,
    dato,
    antall: 120,
  },
  {
    fagsakYtelseType: 'PSB',
    behandlingType: 'Revurdering',
    behandlendeEnhet: '1337',
    fagsystemType: OppgaveSystem.PUNSJ,
    dato,
    antall: 11,
  },
];

export default løsteAksjonspunkterPerEnhet;
