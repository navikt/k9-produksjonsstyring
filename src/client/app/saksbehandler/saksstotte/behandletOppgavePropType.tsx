import PropTypes from 'prop-types';

const behandletOppgavePropType = PropTypes.shape({

  saksnummer: PropTypes.string.isRequired,
  behandlingId: PropTypes.number,
  navn: PropTypes.string.isRequired,
  personnummer: PropTypes.string.isRequired,
  eksternId: PropTypes.string.isRequired,
});

export default behandletOppgavePropType;
