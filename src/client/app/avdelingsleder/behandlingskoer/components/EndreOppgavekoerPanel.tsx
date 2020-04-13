
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
  setValgtOppgavekoId: (oppgavekoId: string) => void;
  lagNyOppgaveko: (avdelingEnhet: string) => void;
  fjernOppgaveko: (oppgavekoId: string, avdelingEnhet: string) => void;
  lagreOppgavekoNavn: (oppgaveko: {oppgavekoId: string; navn: string}, avdelingEnhet: string) => void;
  lagreOppgavekoBehandlingstype: (oppgavekoId: string, behandlingType: Kodeverk, isChecked: boolean, avdelingEnhet: string) => void;
  lagreOppgavekoFagsakYtelseType: (oppgavekoId: string, fagsakYtelseType: string, avdelingEnhet: string) => void;
  lagreOppgavekoAndreKriterier: (oppgavekoId: string, andreKriterierType: Kodeverk, isChecked: boolean, skalInkludere: boolean, avdelingEnhet: string) => void;
  knyttSaksbehandlerTilOppgaveko: (oppgavekoId: string, brukerIdent: string, isChecked: boolean, avdelingEnhet: string) => void;
  valgtOppgavekoId?: string;
  hentAvdelingensOppgavekoer: (avdelingEnhet: string) => Oppgaveko[];
  hentAntallOppgaverForOppgaveko: (oppgavekoId: string, avdelingEnhet: string) => Promise<string>;
  hentAntallOppgaverForAvdeling: (avdelingEnhet: string) => Promise<string>;
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
  hentAvdelingensOppgavekoer,
  hentAntallOppgaverForOppgaveko,
  hentAntallOppgaverForAvdeling,
}: TsProps) => {
  const valgtOppgaveko = oppgavekoer.find(s => s.oppgavekoId === valgtOppgavekoId);
  return (
    <>
      <GjeldendeOppgavekoerTabell
        oppgavekoer={oppgavekoer}
        setValgtOppgavekoId={setValgtOppgavekoId}
        valgtOppgavekoId={valgtOppgavekoId}
        lagNyOppgaveko={lagNyOppgaveko}
        fjernOppgaveko={fjernOppgaveko}
        hentAvdelingensOppgavekoer={hentAvdelingensOppgavekoer}
        hentAntallOppgaverForAvdeling={hentAntallOppgaverForAvdeling}
      />
      <VerticalSpacer sixteenPx />
      {valgtOppgavekoId && valgtOppgaveko && (
        <>
          <UtvalgskriterierForOppgavekoForm
            valgtOppgaveko={valgtOppgaveko}
            lagreOppgavekoNavn={lagreOppgavekoNavn}
            lagreOppgavekoBehandlingstype={lagreOppgavekoBehandlingstype}
            lagreOppgavekoFagsakYtelseType={lagreOppgavekoFagsakYtelseType}
            lagreOppgavekoAndreKriterier={lagreOppgavekoAndreKriterier}
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
  lagNyOppgaveko: PropTypes.func.isRequired,
  fjernOppgaveko: PropTypes.func.isRequired,
  lagreOppgavekoNavn: PropTypes.func.isRequired,
  lagreOppgavekoBehandlingstype: PropTypes.func.isRequired,
  lagreOppgavekoFagsakYtelseType: PropTypes.func.isRequired,
  knyttSaksbehandlerTilOppgaveko: PropTypes.func.isRequired,
  lagreOppgavekoAndreKriterier: PropTypes.func.isRequired,
  valgtOppgavekoId: PropTypes.string,
  hentAntallOppgaverForOppgaveko: PropTypes.func.isRequired,
  hentAntallOppgaverForAvdeling: PropTypes.func.isRequired,
};

EndreOppgavekoerPanel.defaultProps = {
  valgtOppgavekoId: undefined,
};

export default EndreOppgavekoerPanel;
