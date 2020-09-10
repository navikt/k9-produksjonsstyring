import React, { FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Saksbehandler } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import { FlexRow, FlexColumn } from 'sharedComponents/flexGrid';
import { Normaltekst } from 'nav-frontend-typografi';

import styles from './saksbehandlerInfo.less';

interface OwnProps {
    saksbehandler: Saksbehandler
}

const SaksbehandlerInfo: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  saksbehandler,
  intl,
}) => (
  <FlexRow>
    <FlexColumn className={styles.koer}>
      <Normaltekst className={styles.overskrift}>Køer</Normaltekst>
    </FlexColumn>
  </FlexRow>
);

export default injectIntl(SaksbehandlerInfo);
