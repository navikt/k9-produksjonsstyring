import React, { FunctionComponent, useState } from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import NavFrontendSpinner from 'nav-frontend-spinner';

import { ALLE_YTELSETYPER_VALGT, UKE_2 } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import GrafContainer from 'avdelingsleder/GrafContainer';
import { getValueFromLocalStorage } from 'utils/localStorageHelper';
import AksjonspunkterPerEnhetDiagram from './AksjonspunkterPerEnhetDiagram';
import AksjonspunkterPerEnhetType from 'avdelingsleder/nokkeltall/AksjonspunkterPerEnhetType';
import { Error } from 'app/errorTsType';

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
      return <NavFrontendSpinner />;
    }

    if (error) {
      return <>Noe gikk galt under lasting</>;
    }

    return (
      <AksjonspunkterPerEnhetDiagram
        aksjonspunkterPerEnhet={aksjonspunkterPerEnhet}
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
