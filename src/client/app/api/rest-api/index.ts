import getAxiosHttpClientApi from './src/axios/axiosHttpClientApi';
import RequestApi from './src/requestApi/RequestApi';
import RequestConfig from './src/RequestConfig';

export { default as NotificationMapper } from './src/requestApi/NotificationMapper';
export { REQUEST_POLLING_CANCELLED } from './src/requestApi/RequestProcess';
export { default as RestApiConfigBuilder } from './src/RestApiConfigBuilder';
export { ErrorTypes, errorOfType, getErrorResponseData } from './src/requestApi/error/ErrorTypes';
export { default as ErrorType } from './src/requestApi/error/errorTsType';

export const createRequestApi = (configs: RequestConfig[]) => new RequestApi(getAxiosHttpClientApi(), configs);
