import React, { FunctionComponent, useState } from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import NavFrontendSpinner from 'nav-frontend-spinner';

import { ALLE_YTELSETYPER_VALGT, UKE_2 } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import GrafContainer from 'avdelingsleder/GrafContainer';
import { getValueFromLocalStorage } from 'utils/localStorageHelper';
import BehandlingerGårAvVentÅrsakerDiagram from './BehandlingerGårAvVentÅrsakerDiagram';
import { baseURL } from 'api/rest-api/src/axios/initRestMethods';
import axios from 'axios';

const BehandlingerGårAvVentÅrsaker: FunctionComponent = () => {
  const id = 'behandlingerSomGaarAvVentAarsaker';
  const { data, isLoading, error } = useQuery(id, () =>
    axios
      .get(`${baseURL()}/avdelingsleder/nokkeltall/alle-paa-vent_v2`, {
        headers: {
          'Nav-Callid': `CallId_${new Date().getTime()}_${Math.floor(Math.random() * 1000000000)}`,
        },
        withCredentials: true,
      })
      .then(res => res.data),
  );
  const [valgtYtelseType, setValgtYtelseType] = useState<string>(
    getValueFromLocalStorage(`${id}-ytelsestype`) || ALLE_YTELSETYPER_VALGT,
  );

  const [antallUkerSomSkalVises, setAntallUkerSomSkalVises] = useState<string>(
    getValueFromLocalStorage(`${id}-uker`) || UKE_2,
  );

  const intl = useIntl();

  const behandlingerSomGaarAvVentAarsakerVisning = () => {
    if (isLoading) {
      return <NavFrontendSpinner />;
    }

    if (error) {
      return <>Noe gikk galt under lasting</>;
    }

    return (
      <BehandlingerGårAvVentÅrsakerDiagram
        behandlingerGaarAvVentAarsaker={data?.påVentMedVenteårsak}
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
      tittel={intl.formatMessage({ id: 'BehandlingerGårAvVentÅrsaker.Tittel' })}
      fremITid
    >
      {behandlingerSomGaarAvVentAarsakerVisning()}
    </GrafContainer>
  );
};
export default BehandlingerGårAvVentÅrsaker;
