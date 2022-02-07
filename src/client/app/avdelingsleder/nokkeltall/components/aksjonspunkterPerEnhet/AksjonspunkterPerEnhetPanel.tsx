import React, { FunctionComponent, useState } from 'react';
import { useIntl } from 'react-intl';

import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import { punsjKodeverkNavn } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import GrafBoks from 'avdelingsleder/GrafBoks';
import AksjonspunkterPerEnhetType from './aksjonspunkterPerEnhetType';

interface OwnProps {
  aksjonspunkterPerEnhet: AksjonspunkterPerEnhetType[];
}

const AksjonspunkterPerEnhet: FunctionComponent<OwnProps> = ({ aksjonspunkterPerEnhet }) => {
  const [valgtYtelseType, setValgtYtelseType] = useState<string>('Alle');
  const [antallUkerSomSkalVises, setAntallUkerSomSkalVises] = useState<string>('2');

  const PSBBehandlinger: AksjonspunkterPerEnhetType[] = aksjonspunkterPerEnhet.filter(
    behandling =>
      behandling.fagsakYtelseType.kode === fagsakYtelseType.PLEIEPENGER_SYKT_BARN &&
      behandling.behandlingType.kodeverk !== punsjKodeverkNavn,
  );

  const OMPBehandlinger: AksjonspunkterPerEnhetType[] = aksjonspunkterPerEnhet.filter(
    behandling => behandling.fagsakYtelseType.kode === fagsakYtelseType.OMSORGSPENGER,
  );

  const OMDBehandlinger: AksjonspunkterPerEnhetType[] = aksjonspunkterPerEnhet.filter(
    behandling =>
      behandling.fagsakYtelseType.kode === fagsakYtelseType.OMSORGSDAGER ||
      behandling.fagsakYtelseType.kode === fagsakYtelseType.OMSORGSDAGER_KRONISKSYK ||
      behandling.fagsakYtelseType.kode === fagsakYtelseType.OMSORGSDAGER_ALENEOMOMSORGEN ||
      behandling.fagsakYtelseType.kode === fagsakYtelseType.OMSORGSDAGER_MIDLERTIDIGALENE,
  );

  const PunsjBehandlinger: AksjonspunkterPerEnhetType[] = aksjonspunkterPerEnhet.filter(
    behandling => behandling.behandlingType.kodeverk === punsjKodeverkNavn,
  );

  const AlleBehandlingerUtomPunsj: AksjonspunkterPerEnhetType[] = aksjonspunkterPerEnhet.filter(
    behandling => behandling.behandlingType.kodeverk !== punsjKodeverkNavn,
  );

  const hentBehandlingerKnyttetTilYtelseType = () => {
    switch (valgtYtelseType) {
      case fagsakYtelseType.PLEIEPENGER_SYKT_BARN:
        return PSBBehandlinger;
      case fagsakYtelseType.OMSORGSPENGER:
        return OMPBehandlinger;
      case fagsakYtelseType.OMSORGSDAGER:
        return OMDBehandlinger;
      case fagsakYtelseType.PUNSJ:
        return PunsjBehandlinger;
      default:
        return AlleBehandlingerUtomPunsj;
    }
  };
  const intl = useIntl();
  return (
    <GrafBoks
      setValgtYtelseType={setValgtYtelseType}
      setAntallUkerSomSkalVises={setAntallUkerSomSkalVises}
      tittel={intl.formatMessage({ id: 'AksjonspunkterPerEnhet.Tittel' })}
    >
      <>{'her kommer ei graf'}</>
    </GrafBoks>
  );
};
export default AksjonspunkterPerEnhet;
