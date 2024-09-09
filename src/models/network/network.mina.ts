import Network, {
  NETWORK_NAME,
  NETWORK_TYPE,
  ZK_CHAIN,
  getZKNetworkMetadata,
} from './network';

const NetworkMina: Network = {
  name: NETWORK_NAME.MINA,
  type: NETWORK_TYPE.ZK,
  nativeCurrency: {
    name: 'MINA',
    symbol: 'MINA',
    decimals: 9,
  },
  metadata: {
    ...getZKNetworkMetadata(
      process.env.NEXT_PUBLIC_REQUIRED_MINA_NETWORK as ZK_CHAIN
    ),
    logo: {
      base: '/assets/logos/logo.mina.circle.svg',
      header: '/assets/logos/logo.mina.circle.svg',
    },
  },
};

export function getMinaAccountScan(addr: string) {
  return `${NetworkMina.metadata.scanUrl}/account/${addr}?type=zk-acc`;
}

export default NetworkMina;
