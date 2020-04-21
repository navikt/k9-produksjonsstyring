import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getKodeverk } from 'kodeverk/duck';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import kodeverkPropType from 'kodeverk/kodeverkPropType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import behandlingType from 'kodeverk/behandlingType';
import { CheckboxField } from 'form/FinalFields';

interface TsProps {
  behandlingTyper: Kodeverk[];
  valgtOppgavekoId: string;
  lagreOppgavekoBehandlingstype: (oppgavekoId: string, behandlingType: Kodeverk, isChecked: boolean) => void;
}

/**
 * BehandlingstypeVelger
 */
export const BehandlingstypeVelger = ({
  behandlingTyper,
  valgtOppgavekoId,
  lagreOppgavekoBehandlingstype,
}: TsProps) => (
  <>
    <Undertekst>
      <FormattedMessage id="BehandlingstypeVelger.Behandlingstype" />
    </Undertekst>
    <VerticalSpacer eightPx />
    {behandlingTyper.map(bt => (
      <CheckboxField
        key={bt.kode}
        name={bt.kode}
        label={bt.navn}
        onChange={isChecked => lagreOppgavekoBehandlingstype(valgtOppgavekoId, bt, isChecked)}
      />
    ))
    }
  </>
);

BehandlingstypeVelger.propTypes = {
  behandlingTyper: PropTypes.arrayOf(kodeverkPropType).isRequired,
  valgtOppgavekoId: PropTypes.string.isRequired,
  lagreOppgavekoBehandlingstype: PropTypes.func.isRequired,
};

const behandlingstypeOrder = Object.values(behandlingType);

const getFiltrerteOgSorterteBehandlingstyper = createSelector(
  [getKodeverk(kodeverkTyper.BEHANDLING_TYPE)], behandlingsTyper => behandlingstypeOrder.map(kode => behandlingsTyper.find(bt => bt.kode === kode)),
);

const mapStateToProps = state => ({
  behandlingTyper: getFiltrerteOgSorterteBehandlingstyper(state),
});

export default connect(mapStateToProps)(BehandlingstypeVelger);
