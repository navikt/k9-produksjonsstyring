import apiPaths from 'api/apiPaths';

const absoluteBaseURL = 'http://localhost:8030/api';
const relativeBaseURL = '/api';

// prepend every apipaths value with baseUrlForTests and keep the types
export const absoluteTestApiPaths = Object.keys(apiPaths).reduce((acc, key) => {
	acc[key] = absoluteBaseURL + apiPaths[key];
	return acc;
}, {}) as typeof apiPaths;

// prepend apiPaths with RelativeBaseURL and keep the types
export const relativeTestApiPaths = Object.keys(apiPaths).reduce((acc, key) => {
	acc[key] = relativeBaseURL + apiPaths[key];
	return acc;
}, {}) as typeof apiPaths;
console.log(relativeTestApiPaths);
