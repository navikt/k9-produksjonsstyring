declare global {
	interface Window {
		env: {
			OIDC_PROXY_URL?: string;
			LOGIN_REDIRECT_URL?: string;
			SAKSBEHANDLER_KAN_VELGE_NYE_KOER?: string;
			AVDELINGSLEDER_TILGANG_TIL_NYE_KOER?: string;
			VERDIKJEDE?: string;
		};
	}
}

interface EnvVariable {
	key: string;
	value: string;
}

interface EnvVariables {
	OIDC_PROXY_URL: string;
	LOGIN_REDIRECT_URL: string;
	K9_LOS_URL: string;
	SAKSBEHANDLER_KAN_VELGE_NYE_KOER: string;
	AVDELINGSLEDER_TILGANG_TIL_NYE_KOER: string;
	VERDIKJEDE: string;
}

export const setEnvVariables = async () => {
	try {
		const response = await fetch('/envVariables');
		const data: EnvVariable[] = await response.json();
		const envVariables = data.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {}) as EnvVariables;
		window.env = window?.env || {};
		window.env.OIDC_PROXY_URL = envVariables.OIDC_PROXY_URL;
		window.env.SAKSBEHANDLER_KAN_VELGE_NYE_KOER = envVariables.SAKSBEHANDLER_KAN_VELGE_NYE_KOER;
		window.env.AVDELINGSLEDER_TILGANG_TIL_NYE_KOER = envVariables.AVDELINGSLEDER_TILGANG_TIL_NYE_KOER;
		window.env.VERDIKJEDE = envVariables.VERDIKJEDE;
		window.env.LOGIN_REDIRECT_URL = envVariables.LOGIN_REDIRECT_URL;
	} catch (error) {
		console.error('Failed to set environment variables', error);
		throw error;
	}

	return Promise.resolve();
};

export const saksbehandlerKanVelgeNyeKoer = () => window?.env?.SAKSBEHANDLER_KAN_VELGE_NYE_KOER === 'enabled';
export const avdelingslederTilgangTilNyeKoer = () => window?.env?.AVDELINGSLEDER_TILGANG_TIL_NYE_KOER === 'enabled';
export const erVerdikjede = () => window?.env?.VERDIKJEDE === 'true';
