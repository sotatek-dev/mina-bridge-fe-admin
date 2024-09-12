import { PROVIDER_TYPE } from '../contract/evm/contract';

// enum configs
export enum NETWORK_NAME {
  ETHEREUM = 'ethereum',
  MINA = 'mina',
}

export enum NETWORK_TYPE {
  EVM = 'EVM',
  ZK = 'ZK',
}

export enum EVM_CHAIN {
  MAINNET = 'mainnet',
  RINKEBY = 'rinkeby',
  GOERLI = 'goerli',
  ROPSTEN = 'ropsten',
  SEPOLIA = 'sepolia',
}

export enum ZK_CHAIN {
  MAINNET = 'Mainnet',
  DEVNET = 'Devnet',
  BERKELEY = 'Berkeley',
  TESTWORLD2 = 'testworld2',
}

export enum CHAIN_TYPE {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
  DEVNET = 'devnet',
}

// used types
// evm chain types
export type NetworkEVMProviderType = {
  type: PROVIDER_TYPE.HTTP | PROVIDER_TYPE.HTTPS;
  uri: string;
};

export type NetworkLogo = {
  base: string;
  header: string;
};

export type NativeCurrency = {
  name: string;
  symbol: string;
  decimals: number;
};

export type NetworkEVMChainMetadataType = {
  chainId: string;
  chainType: CHAIN_TYPE;
  chainName: string;
  provider: NetworkEVMProviderType;
  scanUrl: string;
};

export type NetworkEVMmetadataType = {
  logo: NetworkLogo;
} & NetworkEVMChainMetadataType;

// zk chain types
export type NetworkZKChainMetadataType = {
  chainId: ZK_CHAIN;
  chainType: CHAIN_TYPE;
  chainName: string;
  proxyUrl?: string;
  scanUrl: string;
};

export type NetworkZKmetadataType = {
  logo: NetworkLogo;
} & NetworkZKChainMetadataType;

// constants
export const EVM_CHAINS_METADATA: Record<
  EVM_CHAIN,
  NetworkEVMChainMetadataType
> = {
  [EVM_CHAIN.MAINNET]: {
    chainId: '0x1',
    chainType: CHAIN_TYPE.MAINNET,
    chainName: 'ethereum',
    provider: {
      type: PROVIDER_TYPE.HTTPS,
      uri: 'https://mainnet.infura.io/v3/',
    },
    scanUrl: 'https://etherscan.io',
  },
  [EVM_CHAIN.ROPSTEN]: {
    chainId: '0x3',
    chainType: CHAIN_TYPE.TESTNET,
    chainName: 'ropsten',
    provider: {
      type: PROVIDER_TYPE.HTTPS,
      uri: '',
    },
    scanUrl: 'https://etherscan.io',
  },
  [EVM_CHAIN.RINKEBY]: {
    chainId: '0x4',
    chainType: CHAIN_TYPE.TESTNET,
    chainName: 'rinkeby',
    provider: {
      type: PROVIDER_TYPE.HTTPS,
      uri: '',
    },
    scanUrl: 'https://etherscan.io',
  },
  [EVM_CHAIN.GOERLI]: {
    chainId: '0x5',
    chainType: CHAIN_TYPE.TESTNET,
    chainName: 'goerli',
    provider: {
      type: PROVIDER_TYPE.HTTPS,
      uri: 'https://goerli.infura.io/v3/8b363db117304afe889f33028045a2c3',
    },
    scanUrl: 'https://etherscan.io',
  },
  [EVM_CHAIN.SEPOLIA]: {
    chainId: '0xaa36a7',
    chainType: CHAIN_TYPE.TESTNET,
    chainName: 'sepolia',
    provider: {
      type: PROVIDER_TYPE.HTTPS,
      uri: 'https://rpc.sepolia.ethpandaops.io',
    },
    scanUrl: 'https://sepolia.etherscan.io',
  },
};

export const getEVMMetadata = (chain: EVM_CHAIN) => EVM_CHAINS_METADATA[chain];

export const ZK_CHAINS_METADATA: Record<ZK_CHAIN, NetworkZKChainMetadataType> =
  {
    [ZK_CHAIN.MAINNET]: {
      chainId: ZK_CHAIN.MAINNET,
      chainType: CHAIN_TYPE.MAINNET,
      chainName: 'Mina',
      proxyUrl: 'https://proxy.minaexplorer.com/',
      scanUrl: 'https://minascan.io/mainnet',
    },
    [ZK_CHAIN.DEVNET]: {
      chainId: ZK_CHAIN.DEVNET,
      chainType: CHAIN_TYPE.DEVNET,
      chainName: 'Mina Devnet',
      proxyUrl: 'https://proxy.devnet.minaexplorer.com/',
      scanUrl: 'https://minascan.io/devnet',
    },
    [ZK_CHAIN.BERKELEY]: {
      chainId: ZK_CHAIN.BERKELEY,
      chainType: CHAIN_TYPE.TESTNET,
      chainName: 'Berkeley',
      proxyUrl: 'https://proxy.berkeley.minaexplorer.com/',
      scanUrl: 'https://minascan.io/berkeley',
    },
    [ZK_CHAIN.TESTWORLD2]: {
      chainId: ZK_CHAIN.TESTWORLD2,
      chainType: CHAIN_TYPE.TESTNET,
      chainName: 'Mina Test world 2',
      proxyUrl: '',
      scanUrl: 'https://minascan.io/testworld',
    },
  };

export const getZKNetworkMetadata = (
  chain: ZK_CHAIN
): NetworkZKChainMetadataType => ZK_CHAINS_METADATA[chain];

// default export
type Network =
  | {
      name: NETWORK_NAME.ETHEREUM;
      type: NETWORK_TYPE.EVM;
      nativeCurrency: NativeCurrency;
      metadata: NetworkEVMmetadataType;
    }
  | {
      name: NETWORK_NAME.MINA;
      type: NETWORK_TYPE.ZK;
      nativeCurrency: NativeCurrency;
      metadata: NetworkZKmetadataType;
    };
export default Network;
