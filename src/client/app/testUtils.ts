/* eslint-disable @typescript-eslint/no-explicit-any */
import apiPaths from 'api/apiPaths';

const absoluteBaseURL = 'http://localhost:8030/api';
const relativeBaseURL = '/api';
// prepend every apipaths value with baseUrlForTests and keep the types
export const absoluteTestApiPaths = Object.keys(apiPaths).reduce((acc, key) => {
	if (typeof apiPaths[key] === 'function') {
		acc[key] = (...args: any[]) => absoluteBaseURL + apiPaths[key](...args);
	} else {
		acc[key] = absoluteBaseURL + apiPaths[key];
	}
	return acc;
}, {}) as typeof apiPaths;

// prepend apiPaths with RelativeBaseURL and keep the types
export const relativeTestApiPaths = Object.keys(apiPaths).reduce((acc, key) => {
	if (typeof apiPaths[key] === 'function') {
		acc[key] = (...args: any[]) => relativeBaseURL + apiPaths[key](...args);
	} else {
		acc[key] = relativeBaseURL + apiPaths[key];
	}
	return acc;
}, {}) as typeof apiPaths;
