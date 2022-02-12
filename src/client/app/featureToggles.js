const parseBoolean = v => (v === 'true' ? true : false);

export default { AKSJONSPUNKTER_PER_ENHET: parseBoolean(process.env.AKSJONSPUNKTER_PER_ENHET) };
