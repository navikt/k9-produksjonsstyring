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
import Teller from './Teller';
import styles from './ferdigstiltePanel.less';

interface OwnProps {
    width: number;
    height: number;
    ferdigstilteOppgaver: FerdigstilteOppgaver[]
}

export const FerdigstiltePanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  width,
  height,
  ferdigstilteOppgaver,
}) => (
  <Form
    onSubmit={() => undefined}
    render={({ values }) => (
      <>
        <Element>
          <FormattedMessage id="FerdigstiltePanel.AntallFerdigstilte" />
        </Element>
        <VerticalSpacer eightPx />
        <Panel className={styles.panel}>
          <div className={styles.container}>
            {ferdigstilteOppgaver.map((bt) => (
              <Teller
                key={bt.behandlingType.kode}
                info={bt}
              />
            ))}
          </div>
        </Panel>
      </>
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
