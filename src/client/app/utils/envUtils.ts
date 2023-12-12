// eslint-disable-next-line import/prefer-default-export, @typescript-eslint/no-explicit-any
export const getEnvironmentVariable = (variableName: string) => (window as any).appSettings[variableName];
