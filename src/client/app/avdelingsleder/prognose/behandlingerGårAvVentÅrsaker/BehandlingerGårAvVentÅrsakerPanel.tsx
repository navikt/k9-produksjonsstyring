import React, { FunctionComponent, useState } from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import NavFrontendSpinner from 'nav-frontend-spinner';

import { ALLE_YTELSETYPER_VALGT, UKE_2 } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import GrafContainer from 'avdelingsleder/GrafContainer';
import { getValueFromLocalStorage } from 'utils/localStorageHelper';
import BehandlingerGårAvVentÅrsakerDiagram from './BehandlingerGårAvVentÅrsakerDiagram';
import {IBehandlingerSomGarAvVentType, IPaaVentResponse} from '../behandlingerGårAvVent/behandlingerSomGårAvVentType';
import useRestApi from "../../../api/rest-api-hooks/src/local-data/useRestApi";
import {K9LosApiKeys} from "api/k9LosApi";
import RestApiState from "../../../api/rest-api-hooks/src/RestApiState";

const BehandlingerGårAvVentÅrsakerPanel: FunctionComponent<{ påVentMedVenteårsak: IBehandlingerSomGarAvVentType[]}> = ({påVentMedVenteårsak}) => {
  const id = 'behandlingerSomGaarAvVentAarsaker';
  const [valgtYtelseType, setValgtYtelseType] = useState<string>(
    getValueFromLocalStorage(`${id}-ytelsestype`) || ALLE_YTELSETYPER_VALGT,
  );

  const [antallUkerSomSkalVises, setAntallUkerSomSkalVises] = useState<string>(
    getValueFromLocalStorage(`${id}-uker`) || UKE_2,
  );

  const intl = useIntl();

  const behandlingerSomGaarAvVentAarsakerVisning = () => {
    return (
      <BehandlingerGårAvVentÅrsakerDiagram
        behandlingerGaarAvVentAarsaker={påVentMedVenteårsak}
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
export default BehandlingerGårAvVentÅrsakerPanel;
