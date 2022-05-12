import React from 'react';
import {TextField} from "@navikt/ds-react";
import ArrowBox from "sharedComponents/ArrowBox";
import {Undertekst} from "nav-frontend-typografi";
import {FormattedMessage} from "react-intl";
import styles from './utvalgskriterierForOppgavekoForm.less';
import {useFormik} from 'formik';
import useRestApiRunner from "../../../../api/rest-api-hooks/src/local-data/useRestApiRunner";
import {K9LosApiKeys} from "api/k9LosApi";
import KriterierType from "../../../../types/KriterierType";

const validate = values => {
  const errors: {
    fraBelop?: string;
    tilBelop?: string;
  } = {}

  if (!values.tilBelop) {
    errors.tilBelop = 'Til må ikke være tom.';
  } else if (values.tilBelop < values.fraBelop) {
    errors.tilBelop = 'Til må være større enn fra.';
  }

  return errors;
};

interface OwnProps {
  til: number;
  fra: number;
  oppgaveKoId: string;
}

const BelopSorteringValg: React.FunctionComponent<OwnProps> = ({
  til,
  fra,
  oppgaveKoId
}) => {
  const { startRequest: lagreOppgavekoSorteringBelop} = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_KRITERIER);

  const oppdaterBelop = (fraBelop: number, tilBelop: number) => {
    lagreOppgavekoSorteringBelop({
      id: oppgaveKoId,
      kriterierType: KriterierType.Feilutbetaling,
      inkluder: true,
      fom: fraBelop,
      tom: tilBelop,
    });
  }

  const formik = useFormik({
    initialValues: {fraBelop: fra || 0, tilBelop: til || 0},
    onSubmit: values => oppdaterBelop(values.fraBelop, values.tilBelop),
    validate
  })

  return (<ArrowBox>
    <Undertekst>
      <FormattedMessage id="SorteringVelger.FiltrerPaHeltall"/>
    </Undertekst>
    <form onSubmit={formik.handleSubmit}>
      <div className={styles.belopContainer}>
        <TextField
          name="fraBelop"
          onChange={(e) => formik.handleChange({target: {name: 'fraBelop', value: parseInt(e.target.value)}})}
          value={parseInt(formik.values.fraBelop)}
          onBlur={() => formik.handleSubmit()}
          size="small"
          type="number"
          label="Fra"/>
        <Undertekst className={styles.belop}>
          <FormattedMessage id="SorteringVelger.Valuta"/>
        </Undertekst>
        <TextField
          name="tilBelop"
          onChange={(e) => formik.handleChange({target: {name: 'tilBelop', value: parseInt(e.target.value)}})}
          value={formik.values.tilBelop}
          onBlur={() => formik.handleSubmit()}
          size="small"
          type="number"
          label="Til"
        />
        <Undertekst className={styles.belop}>
          <FormattedMessage id="SorteringVelger.Valuta"/>
        </Undertekst>
      </div>
    </form>
    {(formik.errors.fraBelop || formik.errors.tilBelop) && <span
      className={styles.feilmelding}>{formik.errors.fraBelop ? formik.errors.fraBelop : formik.errors.tilBelop}</span>}
  </ArrowBox>);
};

export default BelopSorteringValg;