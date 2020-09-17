import React, { FunctionComponent } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';

import {
  RadioGroupField, RadioOption,
} from 'form/FinalFields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import KoSorteringType from 'kodeverk/KoSorteringTsType';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import DatoSorteringValg from './DatoSorteringValg';
import styles from './sorteringVelger.less';

interface OwnProps {
  intl: any;
  alleKodeverk: {[key: string]: KoSorteringType[]};
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
const SorteringVelger: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  valgtOppgavekoId,
  valgteBehandlingtyper,
  lagreOppgavekoSortering,
  lagreOppgavekoSorteringTidsintervallDato,
  fomDato,
  tomDato,
  alleKodeverk,
}) => (
  <>
    <Undertekst>
      <FormattedMessage id="SorteringVelger.Sortering" />
    </Undertekst>
    <VerticalSpacer eightPx />
    <div>
      <RadioGroupField
        name="sortering"
        direction="vertical"
        onChange={(sorteringType) => lagreOppgavekoSortering(valgtOppgavekoId, sorteringType)}
      >
        {alleKodeverk[kodeverkTyper.KO_SORTERING].map((koSortering) => (
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
          </RadioOption>
          )
        ))}
      </RadioGroupField>
    </div>
  </>
);

export default injectIntl(SorteringVelger);
