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
import FerdigstilteOppgaver from 'avdelingsleder/nokkeltall/components/ferdigstiltePanel/ferdigstilteOppgaverTsType';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import Teller from './Teller';
import styles from './ferdigstiltePanel.less';

interface OwnProps {
    width: number;
    height: number;
    ferdigstilteOppgaver: FerdigstilteOppgaver[];
    behandlingTyper: Kodeverk[];
}

export const FerdigstiltePanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  width,
  height,
  ferdigstilteOppgaver,
  behandlingTyper,
}) => (
  <Form
    onSubmit={() => undefined}
    render={({ values }) => (
      <Panel className={styles.panel}>
        <Element>
          <FormattedMessage id="FerdigstiltePanel.AntallFerdigstilte" />
        </Element>
        <VerticalSpacer eightPx />
        <div className={styles.container}>
          {ferdigstilteOppgaver.length > 0 && ferdigstilteOppgaver.map((bt) => (
            <Teller
              key={bt.behandlingType.kode}
              behandlingType={bt.behandlingType}
              antallIdag={bt.ferdigstilteIdag}
              antallSyvDager={bt.ferdigstilteSyvDager}
            />
          ))}
          {ferdigstilteOppgaver.length === 0 && behandlingTyper.map((bt) => (
            <Teller
              key={bt.kode}
              behandlingType={bt}
              antallIdag={0}
              antallSyvDager={0}
            />
          )) }
        </div>
      </Panel>
    )}
  />
);

FerdigstiltePanel.defaultProps = {
  ferdigstilteOppgaver: [],
};

const mapStateToProps = (state) => ({
  behandlingTyper: getKodeverk(state)[kodeverkTyper.BEHANDLING_TYPE],
  ferdigstilteOppgaver: getFerdigstilteOppgaver(state),
});

export default connect(mapStateToProps)(injectIntl(FerdigstiltePanel));
