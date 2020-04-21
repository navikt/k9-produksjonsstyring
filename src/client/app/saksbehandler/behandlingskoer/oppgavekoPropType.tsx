import PropTypes from 'prop-types';

import kodeverkPropType from 'kodeverk/kodeverkPropType';

const oppgavekoPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  navn: PropTypes.string.isRequired,
  behandlingTyper: PropTypes.arrayOf(kodeverkPropType).isRequired,
  fagsakYtelseTyper: PropTypes.arrayOf(kodeverkPropType).isRequired,
  andreKriterier: PropTypes.arrayOf(PropTypes.shape({
    andreKriterierType: kodeverkPropType,
    inkluder: PropTypes.bool.isRequired,
  })),
  sortering: PropTypes.shape({
    sorteringType: kodeverkPropType.isRequired,
    fomDato: PropTypes.string,
    tomDato: PropTypes.string,
  }),
});

export default oppgavekoPropType;
