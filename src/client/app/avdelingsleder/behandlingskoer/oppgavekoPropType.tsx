import PropTypes from 'prop-types';

import kodeverkPropType from 'kodeverk/kodeverkPropType';
import saksbehandlerPropType from 'avdelingsleder/saksbehandlere/saksbehandlerPropType';

const oppgavekoPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  navn: PropTypes.string,
  behandlingTyper: PropTypes.arrayOf(kodeverkPropType),
  fagsakYtelseTyper: PropTypes.arrayOf(kodeverkPropType),
  sistEndret: PropTypes.string.isRequired,
  sortering: PropTypes.shape({
    sorteringType: kodeverkPropType.isRequired,
    fra: PropTypes.number,
    til: PropTypes.number,
    fomDato: PropTypes.string,
    tomDato: PropTypes.string,
    erDynamiskPeriode: PropTypes.bool.isRequired,
  }),
  saksbehandlere: PropTypes.arrayOf(saksbehandlerPropType).isRequired,
  antallBehandlinger: PropTypes.number,
  tilBeslutter: PropTypes.bool.isRequired,
  utbetalingTilBruker: PropTypes.bool.isRequired,
  selvstendigFrilans: PropTypes.bool.isRequired,
  kombinert: PropTypes.bool.isRequired,
  søktGradering: PropTypes.bool.isRequired,
  registrerPapir: PropTypes.bool.isRequired,
});

export default oppgavekoPropType;
