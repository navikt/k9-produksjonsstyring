import React, { FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { Form } from 'react-final-form';
import { Element } from 'nav-frontend-typografi';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Panel from 'nav-frontend-paneler';
import { getFerdigstilteOppgaver } from 'avdelingsleder/nokkeltall/duck';
import FerdigstilteOppgaver from 'avdelingsleder/nokkeltall/components/dagensTallPanel/ferdigstilteOppgaverTsType';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import { getNyeOgFerdigstilteOppgaverNokkeltall } from 'saksbehandler/saksstotte/nokkeltall/duck';
import { createSelector } from 'reselect';
import moment from 'moment';
import { ISO_DATE_FORMAT } from 'utils/formats';
import NyeOgFerdigstilteOppgaver from 'saksbehandler/saksstotte/nokkeltall/components/nyeOgFerdigstilteOppgaverTsType';
import styles from './ferdigstiltePanel.less';
import Teller from './Teller';

interface OwnProps {
    width: number;
    height: number;
    nyeOgFerdigstilteOppgaverIdag: NyeOgFerdigstilteOppgaver[];
    behandlingTyper: Kodeverk[];
}

export const InngangOgFerdigstiltePanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({ nyeOgFerdigstilteOppgaverIdag }) => {
  const getNyeIdagTotalt = () => {
    let nye = 0;
    nyeOgFerdigstilteOppgaverIdag.forEach((n) => { nye += n.antallNye; });
    return nye;
  };

  const getFerdigstilteIdagTotalt = () => {
    let ferdigstilte = 0;
    nyeOgFerdigstilteOppgaverIdag.forEach((n) => { ferdigstilte += n.antallFerdigstilte; });
    return ferdigstilte;
  };


  return (
    <Form
      onSubmit={() => undefined}
      render={({ values }) => (
        <Panel className={styles.panel}>
          <Element>
            <FormattedMessage id="InngangOgFerdigstiltePanel.Header" />
          </Element>
          <VerticalSpacer eightPx />
          <div className={styles.container}>
            <Teller forklaring="Totalt" venstreTall={getNyeIdagTotalt()} hoyreTall={getFerdigstilteIdagTotalt()} />
            {nyeOgFerdigstilteOppgaverIdag.length > 0 && nyeOgFerdigstilteOppgaverIdag.map((bt) => (
              <Teller
                key={bt.behandlingType.kode}
                forklaring={bt.behandlingType.navn}
                hoyreTall={bt.antallFerdigstilte}
                venstreTall={bt.antallNye}
              />
            ))}
          </div>
        </Panel>
      )}
    />
  );
};

export const getNyeOgFerdigstilteForIDag = createSelector([getNyeOgFerdigstilteOppgaverNokkeltall], (nyeOgFerdigstilte: { dato: string }[] = []) => {
  const iDag = moment();
  return nyeOgFerdigstilte.filter((oppgave) => iDag.isSame(moment(oppgave.dato, ISO_DATE_FORMAT), 'day'));
});

export const getNyeOgFerdigstilteForSisteSyvDager = createSelector([getNyeOgFerdigstilteOppgaverNokkeltall],
  (nyeOgFerdigstilte: { dato: string }[] = []) => {
    const iDag = moment().startOf('day');
    return nyeOgFerdigstilte.filter((oppgave) => iDag.isAfter(moment(oppgave.dato, ISO_DATE_FORMAT)));
  });

InngangOgFerdigstiltePanel.defaultProps = {
  nyeOgFerdigstilteOppgaverIdag: [],
};

const mapStateToProps = (state) => ({
  behandlingTyper: getKodeverk(state)[kodeverkTyper.BEHANDLING_TYPE],
  nyeOgFerdigstilteOppgaverIdag: getNyeOgFerdigstilteForIDag(state),
  nyeOgFerdigstilteOppgaver7dager: getNyeOgFerdigstilteForSisteSyvDager(state),
});

export default connect(mapStateToProps)(injectIntl(InngangOgFerdigstiltePanel));
