import PropTypes from 'prop-types';

const saksbehandlerPropType = PropTypes.shape({
  brukerIdent: PropTypes.string.isRequired,
  navn: PropTypes.string.isRequired,
  epost: PropTypes.string.isRequired,
});

export default saksbehandlerPropType;
