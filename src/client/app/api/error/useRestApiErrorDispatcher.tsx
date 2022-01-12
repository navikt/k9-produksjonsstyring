import { useContext, useCallback } from 'react';

import { RestApiErrorDispatchContext } from './RestApiErrorContext';

/**
 * Hook for å legge til eller fjerne feil fra rest-kall
 */
const useRestApiErrorDispatcher = () => {
  const dispatch = useContext(RestApiErrorDispatchContext);
  const addErrorMessage = useCallback((data) => {
    if (dispatch) {
      dispatch({ type: 'add', data });
    }
  }, []);

  const removeErrorMessage = useCallback(() => {
    if (dispatch) {
      dispatch({ type: 'remove' });
    }
  }, []);

  return {
    addErrorMessage,
    removeErrorMessage,
  };
};

export default useRestApiErrorDispatcher;
