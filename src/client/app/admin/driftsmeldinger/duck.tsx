import { Dispatch } from 'redux';

import k9LosApi from 'api/k9LosApi';

export const fetchAlleDriftsmeldinger = k9LosApi.DRIFTSMELDINGER.makeRestApiRequest();
export const getDriftsmeldinger = k9LosApi.DRIFTSMELDINGER.getRestApiData();
