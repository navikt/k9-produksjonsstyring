import axios from 'axios';
import { callId } from 'api/rest-api/src/axios/axiosHttpClientApi';
import { baseURL } from 'api/rest-api/src/axios/initRestMethods';

export const defaultQuery = async ({ queryKey }) => {
    const { data } = await axios.get(`${baseURL()}${queryKey[0]}`, {
        headers: {
            'Nav-Callid': callId,
        },
        withCredentials: true,
    });
    return data;
};

export const config = {
    defaultOptions: {
        queries: {
            queryFn: defaultQuery,
        },
    },
};
