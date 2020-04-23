import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getKodeverk } from 'kodeverk/duck';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import kodeverkPropType from 'kodeverk/kodeverkPropType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { RadioGroupField, RadioOption } from 'form/FinalFields';

const finnFagsakYtelseTypeNavn = (fagsakYtelseTyper, valgtFagsakYtelseType) => {
  const type = fagsakYtelseTyper.find(fyt => fyt.kode === valgtFagsakYtelseType);
  return type ? type.navn : '';
};

interface TsProps {
  fagsakYtelseTyper: Kodeverk[];
  valgtOppgavekoId: string;
  lagreOppgavekoFagsakYtelseType: (oppgavekoId: string, fagsakYtelseType: string) => void;
}

/**
 * FagsakYtelseTypeVelger
 */
export const FagsakYtelseTypeVelger = ({
  fagsakYtelseTyper,
  valgtOppgavekoId,
  lagreOppgavekoFagsakYtelseType,
}: TsProps) => (
  <>
    <Undertekst>
      <FormattedMessage id="FagsakYtelseTypeVelger.Stonadstype" />
    </Undertekst>
    <VerticalSpacer eightPx />
    <RadioGroupField
      name="fagsakYtelseType"
      onChange={fyt => lagreOppgavekoFagsakYtelseType(valgtOppgavekoId, fyt)}
    >
      <RadioOption
        value={fagsakYtelseType.OMSORGSPENGER}
        label={finnFagsakYtelseTypeNavn(fagsakYtelseTyper, fagsakYtelseType.OMSORGSPENGER)}
      />
      <RadioOption
        value={fagsakYtelseType.PLEIEPENGER_SYKT_BARN}
        label={finnFagsakYtelseTypeNavn(fagsakYtelseTyper, fagsakYtelseType.PLEIEPENGER_SYKT_BARN)}
      />
      <RadioOption
        value=""
        label={<FormattedMessage id="FagsakYtelseTypeVelger.Alle" />}
      />
    </RadioGroupField>
  </>
);

FagsakYtelseTypeVelger.propTypes = {
  fagsakYtelseTyper: PropTypes.arrayOf(kodeverkPropType).isRequired,
  valgtOppgavekoId: PropTypes.string.isRequired,
  lagreOppgavekoFagsakYtelseType: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fagsakYtelseTyper: getKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE)(state),
});

export default connect(mapStateToProps)(FagsakYtelseTypeVelger);
