import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { bindActionCreators, Dispatch } from 'redux';
import { Undertekst } from 'nav-frontend-typografi';

import {
  RadioGroupField, RadioOption,
} from 'form/FinalFields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkPropType from 'kodeverk/kodeverkPropType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { KoSorteringType } from 'kodeverk/KoSorteringTsType';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import {
  lagreOppgavekoSortering as lagreOppgavekoSorteringActionCreator,
  lagreOppgavekoSorteringErDynamiskPeriode as lagreOppgavekoSorteringErDynamiskPeriodeActionCreator,
  lagreOppgavekoSorteringTidsintervallDato as lagreOppgavekoSorteringTidsintervallDatoActionCreator,
  lagreOppgavekoSorteringNumeriskIntervall as lagreOppgavekoSorteringNumeriskIntervallActionCreator,
} from '../../duck';
import DatoSorteringValg from './DatoSorteringValg';
import BelopSorteringValg from './BelopSorteringValg';

interface TsProps {
  intl: any;
  koSorteringTyper: KoSorteringType[];
  valgtOppgavekoId: string;
  valgteBehandlingtyper: Kodeverk[];
  lagreOppgavekoSortering: (oppgavekoId: string, oppgavekoSorteringValg: KoSorteringType) => void;
  lagreOppgavekoSorteringTidsintervallDato: (oppgavekoId: string, fomDato: string, tomDato: string) => void;
  fomDato: string;
  tomDato: string;
}

/**
 * SorteringVelger
 */
export const SorteringVelger = ({
  intl,
  koSorteringTyper,
  valgtOppgavekoId,
  valgteBehandlingtyper,
  lagreOppgavekoSortering,
  lagreOppgavekoSorteringTidsintervallDato,
  fomDato,
  tomDato,
}: TsProps) => (
  <>
    <Undertekst>
      <FormattedMessage id="SorteringVelger.Sortering" />
    </Undertekst>
    <VerticalSpacer eightPx />
    <RadioGroupField
      name="sortering"
      direction="vertical"
      onChange={sorteringType => lagreOppgavekoSortering(valgtOppgavekoId, sorteringType)}
    >
      {koSorteringTyper.map(koSortering => (
        (koSortering.feltkategori !== 'TILBAKEKREVING' || (valgteBehandlingtyper.length === 1 && valgteBehandlingtyper[0].kode === 'BT-009')) && (
        <RadioOption
          key={koSortering.kode}
          value={koSortering.kode}
          label={koSortering.navn}
        >
          {(koSortering.felttype === 'DATO') && (
          <DatoSorteringValg
            intl={intl}
            valgtOppgavekoId={valgtOppgavekoId}
            lagreOppgavekoSorteringTidsintervallDato={lagreOppgavekoSorteringTidsintervallDato}
            fomDato={fomDato}
            tomDato={tomDato}
          />
          )}
          {(koSortering.felttype === 'HELTALL') && (
          <BelopSorteringValg
            intl={intl}
            valgtOppgavekoId={valgtOppgavekoId}
          />
          )}
        </RadioOption>
          )
      ))}
    </RadioGroupField>
  </>
);

SorteringVelger.propTypes = {
  intl: intlShape.isRequired,
  koSorteringTyper: PropTypes.arrayOf(kodeverkPropType).isRequired,
  valgtOppgavekoId: PropTypes.string.isRequired,
  lagreOppgavekoSortering: PropTypes.func.isRequired,
  lagreOppgavekoSorteringTidsintervallDato: PropTypes.func.isRequired,
  fomDato: PropTypes.string,
  tomDato: PropTypes.string,
};

SorteringVelger.defaultProps = {
  fomDato: undefined,
  tomDato: undefined,
};

const mapStateToProps = state => ({
  koSorteringTyper: getKodeverk(kodeverkTyper.KO_SORTERING)(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  ...bindActionCreators({
    lagreOppgavekoSortering: lagreOppgavekoSorteringActionCreator,
    lagreOppgavekoSorteringTidsintervallDato: lagreOppgavekoSorteringTidsintervallDatoActionCreator,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SorteringVelger));
