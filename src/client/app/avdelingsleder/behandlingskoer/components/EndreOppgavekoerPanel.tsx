
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';

import Image from 'sharedComponents/Image';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import pilNedUrl from 'images/pil-ned.svg';
import GjeldendeOppgavekoerTabell from './GjeldendeOppgavekoerTabell';
import SaksbehandlereForOppgavekoForm from './saksbehandlerForm/SaksbehandlereForOppgavekoForm';
import UtvalgskriterierForOppgavekoForm from './oppgavekoForm/UtvalgskriterierForOppgavekoForm';
import { Oppgaveko } from '../oppgavekoTsType';
import oppgavekoPropType from '../oppgavekoPropType';

import styles from './endreOppgavekoerPanel.less';

interface TsProps {
  oppgavekoer: Oppgaveko[];
  setValgtOppgavekoId: (id: string) => void;
  lagNyOppgaveko: () => void;
  fjernOppgaveko: (id: string) => void;
  lagreOppgavekoNavn: (oppgaveko: {id: string; navn: string}) => void;
  lagreOppgavekoBehandlingstype: (id: string, behandlingType: Kodeverk, isChecked: boolean) => void;
  lagreOppgavekoFagsakYtelseType: (id: string, fagsakYtelseType: string) => void;
  lagreOppgavekoAndreKriterier: (id: string, andreKriterierType: Kodeverk, isChecked: boolean, inkluder: boolean) => void;
  lagreOppgavekoSkjermet: (id: string, isChecked: boolean) => void;
  knyttSaksbehandlerTilOppgaveko: (id: string, epost: string, isChecked: boolean) => void;
  valgtOppgavekoId?: string;
  hentOppgavekoer: () => Oppgaveko[];
  hentAntallOppgaverForOppgaveko: (id: string) => Promise<string>;
  hentAntallOppgaverTotalt: () => Promise<string>;
  hentKo: (id: string) => Promise<string>;
}

/**
 * EndreOppgavekoerPanel
 */
const EndreOppgavekoerPanel = ({
  oppgavekoer,
  setValgtOppgavekoId,
  valgtOppgavekoId,
  lagNyOppgaveko,
  fjernOppgaveko,
  lagreOppgavekoNavn,
  lagreOppgavekoBehandlingstype,
  lagreOppgavekoFagsakYtelseType,
  lagreOppgavekoAndreKriterier,
  knyttSaksbehandlerTilOppgaveko,
  hentOppgavekoer,
  hentAntallOppgaverForOppgaveko,
  hentAntallOppgaverTotalt,
  lagreOppgavekoSkjermet,
  hentKo,
}: TsProps) => {
  const valgtOppgaveko = oppgavekoer.find((s) => s.id === valgtOppgavekoId);
  return (
    <>
      <GjeldendeOppgavekoerTabell
        oppgavekoer={oppgavekoer}
        hentKo={hentKo}
        setValgtOppgavekoId={setValgtOppgavekoId}
        valgtOppgavekoId={valgtOppgavekoId}
        lagNyOppgaveko={lagNyOppgaveko}
        fjernOppgaveko={fjernOppgaveko}
        hentAntallOppgaverTotalt={hentAntallOppgaverTotalt}
      />
      <VerticalSpacer sixteenPx />
      {valgtOppgavekoId && valgtOppgaveko && (
        <>
          <UtvalgskriterierForOppgavekoForm
            lagreOppgavekoNavn={lagreOppgavekoNavn}
            lagreOppgavekoBehandlingstype={lagreOppgavekoBehandlingstype}
            lagreOppgavekoFagsakYtelseType={lagreOppgavekoFagsakYtelseType}
            lagreOppgavekoAndreKriterier={lagreOppgavekoAndreKriterier}
            lagreOppgavekoSkjermet={lagreOppgavekoSkjermet}
            hentAntallOppgaverForOppgaveko={hentAntallOppgaverForOppgaveko}
          />
          <Row>
            <Column xs="5" />
            <Column xs="1">
              <Image altCode="EndreOppgavekoerPanel.Saksbehandlere" src={pilNedUrl} />
            </Column>
            <Column xs="5" className={styles.text}>
              <FormattedMessage id="EndreOppgavekoerPanel.KnyttetMotSaksbehandlere" />
            </Column>
          </Row>
          <SaksbehandlereForOppgavekoForm
            valgtOppgaveko={valgtOppgaveko}
            knyttSaksbehandlerTilOppgaveko={knyttSaksbehandlerTilOppgaveko}
          />
        </>
      )}
    </>
  );
};

EndreOppgavekoerPanel.propTypes = {
  oppgavekoer: PropTypes.arrayOf(oppgavekoPropType).isRequired,
  setValgtOppgavekoId: PropTypes.func.isRequired,
  hentKo: PropTypes.func.isRequired,
  lagNyOppgaveko: PropTypes.func.isRequired,
  fjernOppgaveko: PropTypes.func.isRequired,
  lagreOppgavekoNavn: PropTypes.func.isRequired,
  lagreOppgavekoBehandlingstype: PropTypes.func.isRequired,
  lagreOppgavekoFagsakYtelseType: PropTypes.func.isRequired,
  knyttSaksbehandlerTilOppgaveko: PropTypes.func.isRequired,
  lagreOppgavekoAndreKriterier: PropTypes.func.isRequired,
  valgtOppgavekoId: PropTypes.string,
  hentAntallOppgaverForOppgaveko: PropTypes.func.isRequired,
  hentAntallOppgaverTotalt: PropTypes.func.isRequired,
  lagreOppgavekoSkjermet: PropTypes.func.isRequired,
};

EndreOppgavekoerPanel.defaultProps = {
  valgtOppgavekoId: undefined,
};

export default EndreOppgavekoerPanel;
