// import { CARD_STATUS } from '@/components/modules/modals/components/modalConnectWallet/partials/card';
import { DeviceType } from 'device-detector-js/dist/typings/device';

import Network, { NETWORK_NAME, NETWORK_TYPE } from '../network/network';

import { TokenType } from '@/store/slices/persistSlice';

export enum WALLET_EVENT_NAME {
  ACCOUNTS_CHANGED = 'accountsChanged',
  CHAIN_CHANGED = 'chainChanged',
  DISCONNECT = 'disconnect',
  MESSAGE = 'message',
}

export enum WALLET_NAME {
  METAMASK = 'metamask',
  AURO = 'auro',
}

export enum WALLET_INJECT_OBJ {
  METAMASK = 'ethereum',
  AURO = 'mina',
}

export enum DEVICES {
  PC = 'pc',
  ANDROID = 'android',
  IOS = 'ios',
}

export enum URL_INSTALL_EXTENSION {
  METAMASK = 'https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
  AURO = 'https://chromewebstore.google.com/detail/auro-wallet/cnmamaachppnkjgnildpdmkaakejnhae',
}

export enum URL_INSTALL_IOS {
  METAMASK = 'https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202',
  AURO = 'https://apps.apple.com/us/app/auro-wallet/id1574034920',
}

export enum URL_INSTALL_ANDROID {
  METAMASK = 'https://play.google.com/store/apps/details?id=io.metamask',
  AURO = 'https://play.google.com/store/apps/details?id=com.aurowallet.www.aurowallet',
}

export type DISPLAY_NAME = string;

export type InstallationURL = Record<DEVICES, string>;

export type WALLET_STATUS = string;

export type WalletLogo = {
  base: string;
} & Record<WALLET_STATUS, string>;

export type WalletMetadataType = {
  InjectedObject?: WALLET_INJECT_OBJ;
  logo: WalletLogo;
  supportedNetwork: NETWORK_NAME[];
  installationURL: InstallationURL;
  displayName: DISPLAY_NAME;
  supportedDevices: Record<NETWORK_TYPE, DeviceType[]>;
};

export type WalletInitialDataType = {
  name: WALLET_NAME;
  metadata: WalletMetadataType;
};

export type ResponseConnect = {
  account: string;
  signature: string | ResponseSignature;
};

export default abstract class Wallet {
  name: WALLET_NAME;
  metadata: WalletMetadataType;
  constructor({ name, metadata }: WalletInitialDataType) {
    this.name = name;
    this.metadata = metadata;
  }

  abstract connect(
    network: Network,
    msg: string,
    isSign?: boolean,
    onStart?: () => void,
    onFinish?: () => void,
    onError?: () => void,
    whileHandle?: () => void
  ): Promise<ResponseConnect>;
  abstract createTx(): Promise<string>;
  abstract signTx(): Promise<string>;
  abstract getNetwork(nwType?: NETWORK_TYPE): Promise<string>;
  abstract switchNetwork(network: Network): Promise<boolean>;
  abstract getBalance(
    network: Network,
    userAddr: string,
    asset: TokenType
  ): Promise<string>;
  abstract sendTx(payload: any): Promise<void>;
  abstract addListener(params: {
    eventName: WALLET_EVENT_NAME;
    handler: (args: any) => void;
  }): void;
  abstract removeListener(eventName: WALLET_EVENT_NAME): void;
}
