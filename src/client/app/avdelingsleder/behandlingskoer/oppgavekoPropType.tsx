import PropTypes from 'prop-types';

import kodeverkPropType from 'kodeverk/kodeverkPropType';
import saksbehandlerPropType from 'avdelingsleder/saksbehandlere/saksbehandlerPropType';

const oppgavekoPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  navn: PropTypes.string,
  behandlingTyper: PropTypes.arrayOf(kodeverkPropType),
  fagsakYtelseTyper: PropTypes.arrayOf(kodeverkPropType),
  andreKriterier: PropTypes.arrayOf(PropTypes.shape({
    andreKriterierType: kodeverkPropType,
    inkluder: PropTypes.bool.isRequired,
  })),
  sistEndret: PropTypes.string.isRequired,
  skjermet: PropTypes.bool.isRequired,
  sortering: PropTypes.shape({
    sorteringType: kodeverkPropType.isRequired,
    fomDato: PropTypes.string,
    tomDato: PropTypes.string,
  }),
  saksbehandlere: PropTypes.arrayOf(saksbehandlerPropType).isRequired,
});

export default oppgavekoPropType;
