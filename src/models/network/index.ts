import Network, { NETWORK_NAME } from './network';
import NetworkEthereum from './network.ethereum';
import NetworkMina from './network.mina';

const NETWORKS: Record<NETWORK_NAME, Network> = {
  [NETWORK_NAME.ETHEREUM]: NetworkEthereum,
  [NETWORK_NAME.MINA]: NetworkMina,
};

export type { default as Network } from './network';
export { NETWORK_NAME } from './network';
export type { default as NetworkEthereum } from './network.ethereum';
export type { default as NetworkMina } from './network.mina';
export default NETWORKS;
