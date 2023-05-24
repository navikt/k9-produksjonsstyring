import axios from 'axios';
import { callId } from 'api/rest-api/src/axios/axiosHttpClientApi';

const axiosConfig = {
	headers: {
		'Nav-Callid': callId,
	},
	withCredentials: true,
};

export const get = async (url: string) => {
	try {
		const response = await axios.get(url, axiosConfig);
		return response.data;
	} catch (error) {
		throw new Error(error);
	}
};
