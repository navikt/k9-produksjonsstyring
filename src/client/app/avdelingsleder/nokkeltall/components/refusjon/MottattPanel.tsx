import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import { Form } from 'react-final-form';
import { Element } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';

import StoreValuesInReduxState from 'form/reduxBinding/StoreValuesInReduxState';
import { getValuesFromReduxState } from 'form/reduxBinding/formDuck';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import kodeverkPropType from 'kodeverk/kodeverkPropType';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { getKodeverk } from 'kodeverk/duck';
import { Panel } from 'nav-frontend-paneler';
import CounterBox from 'avdelingsleder/nokkeltall/components/refusjon/CounterBox';
import Envelope from '../../../../../images/envelope.svg';
import styles from './mottattPanel.less';

interface InitialValues {
    ytelseType: string;
    ukevalg: string;
}

interface TsProps {
    intl: any;
    width: number;
    height: number;
    fagsakYtelseTyper: Kodeverk[];
    initialValues: InitialValues;
}

const formName = 'tilBehandlingForm';

/**
 * TilBehandlingPanel.
 */
export const MottattPanel = ({
       intl,
       width,
       height,
       fagsakYtelseTyper,
       initialValues,
   }: TsProps) => (
     <Form
       initialValues={initialValues}
       onSubmit={() => undefined}
       render={({ values }) => (
         <div className={styles.frame}>
           <div className={styles.header}>
             <img src={Envelope} alt="" />
             <FormattedMessage id="MottattPanel.MottattRefusjonskrav" />
           </div>
           <CounterBox
             count={36}
             period="Per dag"
           />
           <CounterBox
             count={187}
             period="Per uke"
           />

           <CounterBox
             count={694}
             period="Per måned"
           />

           <CounterBox
             count={694}
             period="Hittil i år"
             color
           />
         </div>

        )}
     />
);

MottattPanel.propTypes = {

};

MottattPanel.defaultProps = {

};

const mapStateToProps = state => ({
    fagsakYtelseTyper: getKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE)(state),
    initialValues: getValuesFromReduxState(state)[formName],
});

export default connect(mapStateToProps)(injectIntl(MottattPanel));
