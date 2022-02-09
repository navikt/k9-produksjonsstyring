import React, { FunctionComponent, useState } from 'react';
import { useIntl } from 'react-intl';

import { ALLE_YTELSETYPER_VALGT, UKE_2 } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import GrafContainer from 'avdelingsleder/GrafContainer';
import { getValueFromLocalStorage } from 'utils/localStorageHelper';
import AksjonspunkterPerEnhetType from './aksjonspunkterPerEnhetType';
import AksjonspunkterPerEnhetDiagram from './AksjonspunkterPerEnhetDiagram';

interface OwnProps {
  aksjonspunkterPerEnhet: AksjonspunkterPerEnhetType[];
}

const AksjonspunkterPerEnhet: FunctionComponent<OwnProps> = ({ aksjonspunkterPerEnhet }) => {
  const id = 'aksjonspunkterPerEnhet';
  const [valgtYtelseType, setValgtYtelseType] = useState<string>(
    getValueFromLocalStorage(`${id}-ytelsestype`) || ALLE_YTELSETYPER_VALGT,
  );

  const [antallUkerSomSkalVises, setAntallUkerSomSkalVises] = useState<string>(
    getValueFromLocalStorage(`${id}-uker`) || UKE_2,
  );

  const intl = useIntl();
  return (
    <GrafContainer
      id={id}
      valgtYtelseType={valgtYtelseType}
      antallUkerSomSkalVises={antallUkerSomSkalVises}
      setValgtYtelseType={setValgtYtelseType}
      setAntallUkerSomSkalVises={setAntallUkerSomSkalVises}
      tittel={intl.formatMessage({ id: 'AksjonspunkterPerEnhet.Tittel' })}
    >
      <AksjonspunkterPerEnhetDiagram aksjonspunkterPerEnhet={aksjonspunkterPerEnhet} valgtYtelseType={valgtYtelseType} />
    </GrafContainer>
  );
};
export default AksjonspunkterPerEnhet;
