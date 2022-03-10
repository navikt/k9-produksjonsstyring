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
    venteårsak: 'ANNET_MANUELT',
    antall: 1,
  },
  {
    fagsakYtelseType: 'OMP_MA',
    behandlingType: 'BT-002',
    frist: dayjs().add(5, 'day'),
    venteårsak: 'ANNET_MANUELT',
    antall: 1,
  },
  {
    fagsakYtelseType: 'OMP_MA',
    behandlingType: 'BT-002',
    frist: dayjs().add(5, 'day'),
    venteårsak: 'ANNET_MANUELT',
    antall: 1,
  },
  {
    fagsakYtelseType: 'OMP_MA',
    behandlingType: 'BT-002',
    frist: dayjs().add(5, 'day'),
    venteårsak: 'ANNET_MANUELT',
    antall: 1,
  },
];

export default behandlingerSomGårAvVentÅrsaker;
