import dayjs from 'dayjs';

const behandlingerSomGårAvVentÅrsaker = [
  {
    fagsakYtelseType: 'OMP_MA',
    behandlingType: 'BT-002',
    frist: dayjs().add(7, 'day'),
    venteårsak: 'AVV_DOK',
    antall: 1,
  },
  {
    fagsakYtelseType: 'OMP_MA',
    behandlingType: 'BT-002',
    frist: dayjs().add(5, 'day'),
    venteårsak: 'VENT_MANGL_FUNKSJ_SAKSBEHANDLER',
    antall: 1,
  },
  {
    fagsakYtelseType: 'OMP_MA',
    behandlingType: 'BT-002',
    frist: dayjs().add(5, 'day'),
    venteårsak: 'VENTER_SVAR_INTERNT',
    antall: 1,
  },
  {
    fagsakYtelseType: 'OMP_MA',
    behandlingType: 'BT-002',
    frist: dayjs().add(5, 'day'),
    venteårsak: 'AUTOMATISK',
    antall: 1,
  },
  {
    fagsakYtelseType: 'OMP_MA',
    behandlingType: 'BT-002',
    frist: dayjs().add(5, 'day'),
    venteårsak: 'UKJENT',
    antall: 1,
  },
  {
    fagsakYtelseType: 'PPN',
    behandlingType: 'BT-002',
    frist: dayjs().add(5, 'day'),
    venteårsak: 'UKJENT',
    antall: 1,
  },
];

export default behandlingerSomGårAvVentÅrsaker;
