import React, { FunctionComponent, useEffect, useCallback } from 'react';

import { bindActionCreators, Dispatch } from 'redux';
import { fetchAlleReservasjoner as fetchAllereservasjonerActionCreator } from 'avdelingsleder/reservasjoner/duck';
import ReservasjonerTabell from './components/ReservasjonerTabell';
import Reservasjon from './reservasjonTsType';


const EMPTY_ARRAY = [];

interface TsProps {
  fetchAlleReservasjoner: () => void;
}

export const ReservasjonerIndex: FunctionComponent<TsProps> = () => (
  <ReservasjonerTabell
    opphevReservasjon={opphevOppgaveReservasjonFn}
    reservasjoner={reservasjoner}
    hentAvdelingensReservasjoner={endreOppgaveReservasjonFn}
  />
);

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    fetchAlleReservasjoner: fetchAllereservasjonerActionCreator,
  }, dispatch),
});

export default ReservasjonerIndex;
