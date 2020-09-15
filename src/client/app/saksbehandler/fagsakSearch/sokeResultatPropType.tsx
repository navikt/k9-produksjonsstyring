import PropTypes from 'prop-types';
import fagsakPropType from 'saksbehandler/fagsakSearch/fagsakPropType';

const sokeResultatPropType = PropTypes.shape({
  ikkeTilgang: PropTypes.bool.isRequired,
  fagsaker: PropTypes.arrayOf(fagsakPropType).isRequired,
});

export default sokeResultatPropType;
