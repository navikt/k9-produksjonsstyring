import PropTypes from 'prop-types';

const personPropType = PropTypes.shape({
  navn: PropTypes.string.isRequired,
  personnummer: PropTypes.string.isRequired,
  kjoenn: PropTypes.string.isRequired,
  doedsdato: PropTypes.string,
});

export default personPropType;
