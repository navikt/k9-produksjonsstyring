import PropTypes from 'prop-types';


const andreKriterierPropType = PropTypes.shape({
    tilBeslutter: PropTypes.bool.isRequired,
    utbetalingTilBruker: PropTypes.bool.isRequired,
    selvstendigFrilans: PropTypes.bool.isRequired,
    kombinert: PropTypes.bool.isRequired,
    søktGradering: PropTypes.bool.isRequired,
    registrerPapir: PropTypes.bool.isRequired,
});

export default andreKriterierPropType;
