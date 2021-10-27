import {
  useState, useEffect, useContext, DependencyList,
} from 'react';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';

import { RestApiDispatchContext, RestApiRequestContext } from '../RestApiContext';
import RestApiState from '../RestApiState';

interface RestApiData<T> {
  state: RestApiState;
  error?: Error;
  data?: T;
}

interface Options {
  updateTriggers?: DependencyList;
  suspendRequest?: boolean;
}

const defaultOptions = {
  updateTriggers: [],
  suspendRequest: false,
};

/**
 * Hook som henter data fra backend (ved mount) og deretter lagrer i @see RestApiContext
 */
function useGlobalStateRestApi<T>(key: RestApiGlobalStatePathsKeys, params: any = {}, options: Options = defaultOptions):RestApiData<T> {
  const [data, setData] = useState({
    state: RestApiState.LOADING,
    error: undefined,
    data: undefined,
  });

  const dispatch = useContext(RestApiDispatchContext);
  const requestApi = useContext(RestApiRequestContext);

  useEffect(() => {
    if (!options.suspendRequest) {
      dispatch({ type: 'remove', key });

      setData({
        state: RestApiState.LOADING,
        error: undefined,
        data: undefined,
      });

      requestApi.startRequest(key, params)
        .then((dataRes) => {
          dispatch({ type: 'success', key, data: dataRes.payload });
          setData({
            state: RestApiState.SUCCESS,
            data: dataRes.payload,
            error: undefined,
          });
        })
        .catch((error) => {
          setData({
            state: RestApiState.ERROR,
            data: undefined,
            error,
          });
        });
    }
  }, options.updateTriggers);

  return data;
}

export default useGlobalStateRestApi;
