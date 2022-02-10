import React, { FunctionComponent } from 'react';
import useRestApi from 'api/rest-api-hooks/src/local-data/useRestApi';
import { K9LosApiKeys } from 'api/k9LosApi';
import AlleOppgaver from 'avdelingsleder/nokkeltall/components/fordelingAvBehandlingstype/alleOppgaverTsType';
import HistoriskData from 'avdelingsleder/nokkeltall/historiskDataTsType';
import NokkeltallPanel from './components/NokkeltallPanel';

const EMPTY_ARRAY = [];

/**
 * NokkeltallIndex
 */

const NokkeltallIndex: FunctionComponent = () => {
  const { data: alleOppgaver = EMPTY_ARRAY } = useRestApi<AlleOppgaver[]>(K9LosApiKeys.HENT_OPPGAVER);
  const { data: ferdigstiltePerDato = EMPTY_ARRAY } = useRestApi<HistoriskData[]>(
    K9LosApiKeys.HENT_FERDIGSTILTE_HISTORIKK,
  );
  const { data: nyePerDato = EMPTY_ARRAY } = useRestApi<HistoriskData[]>(K9LosApiKeys.HENT_NYE_HISTORIKK);
  const { data: beholdningPerDato = EMPTY_ARRAY } = useRestApi<HistoriskData[]>(K9LosApiKeys.HENT_OPPGAVER_PER_DATO);

  const aksjonspunkterPerEnhet = [
    {
      dato: '2022-02-07',
      enhet: '4409',
      antall: 5,
      fagsakYtelseType: {
        kode: 'PSB',
        kodeverk: '',
      },
      behandlingType: { kode: 'Revurdering', kodeverk: 'PUNSJ_INNSENDING_TYPE' },
    },
    {
      dato: '2022-01-28',
      enhet: '4999',
      antall: 1,
      fagsakYtelseType: {
        kode: 'PSB',
        kodeverk: '',
      },
      behandlingType: { kode: 'Revurdering', kodeverk: 'PUNSJ_INNSENDING_TYPE' },
    },
    {
      dato: '2022-01-28',
      enhet: '4999',
      antall: 1,
      fagsakYtelseType: {
        kode: 'PSB',
        kodeverk: '',
      },
      behandlingType: { kode: 'Revurdering', kodeverk: 'PUNSJ_INNSENDING_TYPE' },
    },
    {
      dato: '2022-01-28',
      enhet: '5000',
      antall: 1,
      fagsakYtelseType: {
        kode: 'PSB',
        kodeverk: '',
      },
      behandlingType: { kode: 'Revurdering', kodeverk: 'PUNSJ_INNSENDING_TYPE' },
    },
  ];
  return (
    <NokkeltallPanel
      alleOppgaver={alleOppgaver}
      ferdigstiltePerDato={ferdigstiltePerDato}
      beholdningPerDato={beholdningPerDato}
      nyePerDato={nyePerDato}
      aksjonspunkterPerEnhet={aksjonspunkterPerEnhet}
    />
  );
};

export default NokkeltallIndex;
