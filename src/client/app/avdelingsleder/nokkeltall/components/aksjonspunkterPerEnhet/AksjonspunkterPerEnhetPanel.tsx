import React, { FunctionComponent, useState } from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import { Loader } from '@navikt/ds-react';

import { ALLE_YTELSETYPER_VALGT, UKE_2 } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import GrafContainer from 'avdelingsleder/GrafContainer';
import { getValueFromLocalStorage } from 'utils/localStorageHelper';
import AksjonspunkterPerEnhetType from 'avdelingsleder/nokkeltall/AksjonspunkterPerEnhetType';
import { Error } from 'app/errorTsType';
import AksjonspunkterPerEnhetDiagram from './AksjonspunkterPerEnhetDiagram';

const AksjonspunkterPerEnhetPanel: FunctionComponent = () => {
  const id = 'aksjonspunkterPerEnhet';
  const {
    data: aksjonspunkterPerEnhet,
    isLoading,
    error,
  }: { data: AksjonspunkterPerEnhetType[]; isLoading: boolean; error: Error } = useQuery(
    '/avdelingsleder/nokkeltall/aksjonspunkter-per-enhet-historikk',
  );

  const [valgtYtelseType, setValgtYtelseType] = useState<string>(
    getValueFromLocalStorage(`${id}-ytelsestype`) || ALLE_YTELSETYPER_VALGT,
  );

  const [antallUkerSomSkalVises, setAntallUkerSomSkalVises] = useState<string>(
    getValueFromLocalStorage(`${id}-uker`) || UKE_2,
  );

  const intl = useIntl();

  const aksjonspunktPerEnhetVisning = () => {
    if (isLoading) {
      return <Loader size="large" />;
    }

    if (error) {
      return <>Noe gikk galt under lasting</>;
    }

    const aksjonspunkterPerEnhetMappet = aksjonspunkterPerEnhet.map(v =>
      v.behandlendeEnhet === '4403 NAV ARBEID OG YTELSER OSLO'
        ? { ...v, behandlendeEnhet: v.behandlendeEnhet.replace('OSLO', 'KRISTIANIA') }
        : v,
    );

    return (
      <AksjonspunkterPerEnhetDiagram
        aksjonspunkterPerEnhet={aksjonspunkterPerEnhetMappet}
        valgtYtelseType={valgtYtelseType}
        antallUkerSomSkalVises={antallUkerSomSkalVises}
      />
    );
  };
  return (
    <GrafContainer
      id={id}
      valgtYtelseType={valgtYtelseType}
      antallUkerSomSkalVises={antallUkerSomSkalVises}
      setValgtYtelseType={setValgtYtelseType}
      setAntallUkerSomSkalVises={setAntallUkerSomSkalVises}
      tittel={intl.formatMessage({ id: 'AksjonspunkterPerEnhet.Tittel' })}
    >
      {aksjonspunktPerEnhetVisning()}
    </GrafContainer>
  );
};
export default AksjonspunkterPerEnhetPanel;
