import { baseURL } from 'api/rest-api/src/axios/initRestMethods';
import axios from 'axios';

export const defaultQuery = async ({ queryKey }) => {
  const { data } = await axios.get(`${baseURL()}${queryKey[0]}`, {
    headers: {
      'Nav-Callid': `CallId_${new Date().getTime()}_${Math.floor(Math.random() * 1000000000)}`,
    },
    withCredentials: true,
  });
  return data;
};

export const config = {
  defaultOptions: {
    queries: {
      retry: false,
      defaultQuery,
    },
  },
};
