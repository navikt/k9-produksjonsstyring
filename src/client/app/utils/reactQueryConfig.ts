import axios from 'axios';
import { callId } from 'api/rest-api/src/axios/axiosHttpClientApi';
import { baseURL } from 'api/rest-api/src/axios/initRestMethods';

const axiosConfig = {
	headers: {
		'Nav-Callid': callId,
	},
	withCredentials: true,
};
export const defaultQuery = async ({ queryKey }) => {
	const { data } = await axios.get(`${baseURL()}${queryKey[0]}`, axiosConfig);
	return data;
};

export const defaultMutation = async ({ url, body }) => {
	const { data } = await axios.post(`${baseURL()}${url}`, body, axiosConfig);
	return data;
};

export const config = {
	defaultOptions: {
		queries: {
			queryFn: defaultQuery,
			refetchOnWindowFocus: false,
		},
		mutations: {
			mutationFn: defaultMutation,
		},
	},
};
