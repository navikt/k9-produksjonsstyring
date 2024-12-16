import proxy from 'express-http-proxy';
import url from 'url';
import { requestOboToken, validateToken } from '@navikt/oasis';
import config, { configValueAsJson } from './config.js';
import log from './log.js';

const xTimestamp = 'x-Timestamp';
const stripTrailingSlash = (str) => (str.endsWith('/') ? str.slice(0, -1) : str);

const proxyOptions = (api) => ({
	timeout: 40000,
	proxyReqOptDecorator: async (options, req) => {
		if (process.env.IS_VERDIKJEDE === 'true') {
			return options;
		}
		try {
			const token = req.headers.authorization.replace('Bearer ', '');
			const validationResult = await validateToken(token);
			console.log('Validation result:', validationResult);
			const requestTime = Date.now();
			options.headers[xTimestamp] = requestTime;
			delete options.headers.cookie;

			return new Promise((resolve, reject) => {
				requestOboToken(token, api.scopes).then(
					(obo) => {
						if (!obo.ok) {
							console.error('Error getting OBO token:', obo.error);
							reject(obo.error);
						}
						options.headers.Authorization = `Bearer ${obo.token}`;
						// Log the request details right before resolving
						log.info(
							`Sending request to ${api.url} with path ${req.originalUrl} at ${new Date(requestTime).toISOString()}`,
						);
						resolve(options);
					},
					(error) => {
						console.error(error);
						reject(error);
					},
				);
			});
		} catch (error) {
			console.error(error);
			throw error; // re-throw the error so it can be handled by the caller
		}
	},
	proxyReqPathResolver: (req) => {
		const urlFromApi = url.parse(api.url);
		const pathFromApi = urlFromApi.pathname === '/' ? '' : urlFromApi.pathname;
		const urlFromRequest = url.parse(req.originalUrl);
		let path = urlFromRequest.pathname;

		const PROXY_CONFIG = configValueAsJson({ name: 'PROXY_CONFIG' });
		// go through proxy config and replace the path
		PROXY_CONFIG.apis.forEach((proxyEntry) => {
			if (proxyEntry.backendPath !== undefined) {
				path = path.replace(proxyEntry.path, proxyEntry.backendPath);
			}
		});
		const queryString = urlFromRequest.query;
		const newPath = (pathFromApi || '') + (path || '') + (queryString ? `?${queryString}` : '');
		log.info(`Proxying request from '${req.originalUrl}' to '${stripTrailingSlash(urlFromApi.href)}${newPath}'`);
		return newPath;
	},
	userResHeaderDecorator: (headers, userReq, userRes, proxyReq, proxyRes) => {
		const { statusCode } = proxyRes;
		const requestTime = Date.now() - proxyReq.getHeader(xTimestamp);
		const melding = `${statusCode} ${proxyRes.statusMessage}: ${userReq.method} - ${userReq.originalUrl} (${requestTime}ms)`;
		const callIdValue = proxyReq.getHeader('Nav-Callid');
		if (statusCode >= 500) {
			log.logger.warn(melding, { 'Nav-Callid': callIdValue });
		} else {
			log.logger.info(melding, { 'Nav-Callid': callIdValue });
		}
		return headers;
	},
	// eslint-disable-next-line consistent-return
	proxyErrorHandler(err, res, next) {
		console.error('proxy error', err);
		switch (err && err.code) {
			case 'ENOTFOUND': {
				log.warning(`${err}, with code: ${err.code}`);
				return res.status(404).send();
			}
			case 'ECONNRESET': {
				return res.status(504).send();
			}
			case 'ECONNREFUSED': {
				return res.status(500).send();
			}
			default: {
				log.warning(`${err}, with code: ${err.code}`);
				next(err);
			}
		}
	},
});

// eslint-disable-next-line func-names
const timedOut = function (req, res, next) {
	if (!req.timedout) {
		next();
	} else {
		log.warning(`Request for ${req.originalUrl} timed out!`);
	}
};

const setup = (router) => {
	config.reverseProxyConfig.apis.forEach((api) => {
		router.use(`${api.path}/*`, timedOut, proxy(api.url, proxyOptions(api)));
		console.log(`Proxy set up: ${api.path}/* -> ${api.url}`);
	});
};

export default { setup };
