import React, { FunctionComponent, useState } from 'react';
import stylesFraHistorikkGraf from 'avdelingsleder/nokkeltall/historikkGraf.less';
import Panel from 'nav-frontend-paneler';
import { Select } from 'nav-frontend-skjema';
import { Column, Row } from 'nav-frontend-grid';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { punsjKodeverkNavn, ytelseTyper } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import { IBehandlingerSomGarAvVentType } from './behandlingerSomGårAvVentType';
import BehandlingerGårAvVentGraf from './BehandlingerGårAvVentGraf';
import styles from './behandlingerGårAvVent.less';

interface OwnProps {
  behandlingerSomGårAvVent: IBehandlingerSomGarAvVentType[];
}

const BehandlingerGårAvVent: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  behandlingerSomGårAvVent,
}) => {
  const [valgtYtelseType, setValgtYtelseType] = useState<string>('Alle');
  const [antallUkerSomSkalVises, setAntallUkerSomSkalVises] = useState<string>('2');

  const PSBBehandlinger: IBehandlingerSomGarAvVentType[] = behandlingerSomGårAvVent.filter(
    behandling =>
      behandling.fagsakYtelseType.kode === fagsakYtelseType.PLEIEPENGER_SYKT_BARN &&
      behandling.behandlingType.kodeverk !== punsjKodeverkNavn,
  );

  const OMPBehandlinger: IBehandlingerSomGarAvVentType[] = behandlingerSomGårAvVent.filter(
    behandling => behandling.fagsakYtelseType.kode === fagsakYtelseType.OMSORGSPENGER &&
      behandling.behandlingType.kodeverk !== punsjKodeverkNavn,
  );

  const OMDBehandlinger: IBehandlingerSomGarAvVentType[] = behandlingerSomGårAvVent.filter(
    behandling =>
      (behandling.fagsakYtelseType.kode === fagsakYtelseType.OMSORGSDAGER ||
      behandling.fagsakYtelseType.kode === fagsakYtelseType.OMSORGSDAGER_KRONISKSYK ||
      behandling.fagsakYtelseType.kode === fagsakYtelseType.OMSORGSDAGER_ALENEOMOMSORGEN ||
      behandling.fagsakYtelseType.kode === fagsakYtelseType.OMSORGSDAGER_MIDLERTIDIGALENE) &&
      behandling.behandlingType.kodeverk !== punsjKodeverkNavn,
  );

  const LivetsSluttfaseBehandlinger: IBehandlingerSomGarAvVentType[] = behandlingerSomGårAvVent.filter(
    behandling => behandling.fagsakYtelseType.kode === fagsakYtelseType.PPN &&
      behandling.behandlingType.kodeverk !== punsjKodeverkNavn,
  );

  const PunsjBehandlinger: IBehandlingerSomGarAvVentType[] = behandlingerSomGårAvVent.filter(
    behandling => behandling.behandlingType.kodeverk === punsjKodeverkNavn,
  );

  const AlleBehandlingerUtomPunsj: IBehandlingerSomGarAvVentType[] = behandlingerSomGårAvVent.filter(
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
      case fagsakYtelseType.PPN:
        return LivetsSluttfaseBehandlinger;
      case fagsakYtelseType.PUNSJ:
        return PunsjBehandlinger;
      default:
        return AlleBehandlingerUtomPunsj;
    }
  };

  return (
    <Panel className={stylesFraHistorikkGraf.panel}>
      <div className={styles.tittel}>
        <Element>
          <FormattedMessage id="BehandlingerGårAvVent.Titel" />
        </Element>
        <Hjelpetekst>{intl.formatMessage({ id: 'BehandlingerGårAvVent.Hjelptekst' })}</Hjelpetekst>
      </div>
      <VerticalSpacer eightPx />
      <Row>
        <Column xs="2">
          <Select onChange={e => setAntallUkerSomSkalVises(e.target.value)}>
            <option value="2" selected>
              {intl.formatMessage({ id: 'BehandlingerGårAvVent.ToNesteUker' })}
            </option>
            <option value="4">{intl.formatMessage({ id: 'BehandlingerGårAvVent.FireNesteUker' })}</option>
          </Select>
        </Column>
        <Column xs="2">
          <Select onChange={e => setValgtYtelseType(e.target.value)}>
            <option value="" disabled selected>
              {intl.formatMessage({ id: 'BehandlingerGårAvVent.VelgFagytelseType' })}
            </option>
            {ytelseTyper.map(ytelseValg => (
              <option key={ytelseValg.kode} value={ytelseValg.kode}>
                {ytelseValg.navn}
              </option>
            ))}
          </Select>
        </Column>
      </Row>
      <VerticalSpacer sixteenPx />
      <BehandlingerGårAvVentGraf
        behandlingerSomGårAvVent={hentBehandlingerKnyttetTilYtelseType().map(behandling => ({
          ...behandling,
          dato: behandling.frist,
        }))}
        antallUkerSomSkalVises={antallUkerSomSkalVises}
      />
    </Panel>
  );
};
export default injectIntl(BehandlingerGårAvVent);
