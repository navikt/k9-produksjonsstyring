import PropTypes from 'prop-types';

import kodeverkPropType from 'kodeverk/kodeverkPropType';

const oppgavekoPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  navn: PropTypes.string.isRequired,
  behandlingTyper: PropTypes.arrayOf(kodeverkPropType).isRequired,
  fagsakYtelseTyper: PropTypes.arrayOf(kodeverkPropType).isRequired,
  andreKriterier: PropTypes.arrayOf(kodeverkPropType).isRequired,
  sortering: PropTypes.shape({
    sorteringType: kodeverkPropType.isRequired,
    fomDato: PropTypes.string,
    tomDato: PropTypes.string,
  }),
  skjermet: PropTypes.bool.isRequired,
});

export default oppgavekoPropType;
