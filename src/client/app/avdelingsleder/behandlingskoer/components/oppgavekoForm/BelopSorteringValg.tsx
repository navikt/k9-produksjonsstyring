import React from 'react';
import {TextField} from "@navikt/ds-react";
import ArrowBox from "sharedComponents/ArrowBox";
import {Undertekst} from "nav-frontend-typografi";
import {FormattedMessage} from "react-intl";
import styles from './utvalgskriterierForOppgavekoForm.less';
import {useFormik} from 'formik';

const validate = values => {
  const errors: {
    fraBelop?: string;
    tilBelop?: string;
  } = {}
  if (!values.fraBelop) {
    errors.fraBelop = 'Fra må være større æn null';
  } else if (!values.tilBelop) {
    errors.tilBelop = 'Til må være større æn null';
  } else if (values.tilBelop < values.fraBelop) {
    errors.tilBelop = 'Til verdi må være større æn fra.';
  }

  return errors;
};

interface OwnProps {
  til: number;
  fra: number;
}

const BelopSorteringValg: React.FunctionComponent<OwnProps> = ({
  til,
  fra
}) => {

  const oppdaterBelop = (fraBelop: number, tilBelop: number) => {
    // TODO Legg in apikall her for att oppdatere belop her når backend har endepunkt
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
          onBlur={() => formik.handleSubmit}
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
          onBlur={() => formik.handleSubmit}
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