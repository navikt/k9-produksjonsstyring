import dotenv from 'dotenv';

dotenv.config();

const envVariables = () => [
	{
		key: 'SAKSBEHANDLER_KAN_VELGE_NYE_KOER',
		value: process.env.SAKSBEHANDLER_KAN_VELGE_NYE_KOER,
	},
	{
		key: 'AVDELINGSLEDER_TILGANG_TIL_NYE_KOER',
		value: process.env.AVDELINGSLEDER_TILGANG_TIL_NYE_KOER,
	},
	{
		key: 'VERDIKJEDE',
		value: process.env.VERDIKJEDE,
	},
];

export default envVariables;
