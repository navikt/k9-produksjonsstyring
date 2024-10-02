import { QueryClientConfig } from 'react-query';
import axios from 'axios';
import { callId } from 'api/rest-api/src/axios/axiosHttpClientApi';

const axiosConfig = {
	headers: {
		'Nav-Callid': callId,
	},
	withCredentials: true,
};
export const axiosInstance = axios.create({
	headers: {
		'Nav-Callid': callId,
	},
	withCredentials: true,
});

export const defaultQuery = async ({ queryKey }) => {
	const { data } = await axiosInstance.get(queryKey[0], axiosConfig);
	return data;
};

export const defaultMutation = async ({ url, body }) => {
	const { data } = await axiosInstance.post(url, body, axiosConfig);
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
} as QueryClientConfig;
