import Network, {
  EVM_CHAIN,
  NETWORK_NAME,
  NETWORK_TYPE,
  getEVMMetadata,
} from './network';

const NetworkEthereum: Network = {
  name: NETWORK_NAME.ETHEREUM,
  type: NETWORK_TYPE.EVM,
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  metadata: {
    ...getEVMMetadata(
      process.env.NEXT_PUBLIC_REQUIRED_ETH_NETWORK as EVM_CHAIN
    ),
    logo: {
      base: '/assets/logos/logo.ethereum.circle.svg',
      header: '/assets/logos/logo.ethereum.circle.svg',
    },
  },
};
export default NetworkEthereum;
