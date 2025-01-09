export const IsServer = typeof window === undefined;

export function getEnvNetwork(env: string) {
  const envs = ['development', 'testing', 'production'];
  const networks = ['Testnet', 'Testnet', 'Mainnet'];

  const index = envs.indexOf(env);
  return index !== -1 ? networks[index] : 'Unknown';
}

export enum Action {
  CREATE = 'deploy',
  RE_DEPLOY = 'redeploy',
  DETAIL = 'detail',
}
