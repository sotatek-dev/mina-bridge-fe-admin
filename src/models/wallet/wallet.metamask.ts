import { MetaMaskInpageProvider } from '@metamask/providers';
import { RequestArguments } from '@metamask/providers';
import _ from 'lodash';
import Web3 from 'web3';
import { ProviderMessage, ProviderRpcError } from 'web3';

import { PROVIDER_TYPE, ProviderType } from '../contract/evm/contract';
import Network, {
  getZKChainIdName,
  NETWORK_NAME,
  NETWORK_TYPE,
} from '../network/network';

import Wallet, {
  URL_INSTALL_ANDROID,
  URL_INSTALL_EXTENSION,
  URL_INSTALL_IOS,
  WALLET_EVENT_NAME,
  WALLET_INJECT_OBJ,
  WALLET_NAME,
} from './wallet.abstract';

import ITV from '@/configs/time';
import { IsServer } from '@/constants';
import { handleException, handleRequest } from '@/helpers/asyncHandlers';
import { formWei } from '@/helpers/common';
import { getWeb3Instance } from '@/helpers/evmHandlers';
import { TokenType } from '@/store/slices/persistSlice';

export type WalletMetamaskEvents =
  | {
      eventName: WALLET_EVENT_NAME.ACCOUNTS_CHANGED;
      handler: (accounts?: Array<string>) => void;
    }
  | {
      eventName: WALLET_EVENT_NAME.CHAIN_CHANGED;
      handler: (chainId?: string) => void;
    }
  | {
      eventName: WALLET_EVENT_NAME.DISCONNECT;
      handler: (error?: ProviderRpcError) => void;
    }
  | {
      eventName: WALLET_EVENT_NAME.MESSAGE;
      handler: (message?: ProviderMessage) => void;
    };
export default class WalletMetamask extends Wallet {
  errorList = {
    WALLET_NOT_INSTALLED: `Please install ${this.name} wallet`,
    WALLET_WRONG_CHAIN: 'You have connected to unsupported chain',
    WALLET_CONNECT_FAILED: 'Fail to connect wallet',
    WALLET_CONNECT_REJECTED: 'Signature rejected.',
    WALLET_USER_REJECTED: 'User rejected',
    WALLET_GET_BALANCE_FAIL: 'Can\'t get the current balance',
    MINA_UNKNOWN_SEND_ERROR: 'Unknown mina transaction error',
  };
  errorMessageList = {
    UNKNOWN_MINA_SEND_TX: 'Couldn\'t send zkApp command',
  };

  constructor() {
    super({
      name: WALLET_NAME.METAMASK,
      metadata: {
        displayName: 'Metamask',
        supportedNetwork: [NETWORK_NAME.MINA, NETWORK_NAME.ETHEREUM],
        InjectedObject: WALLET_INJECT_OBJ.METAMASK,
        logo: {
          base: '/assets/logos/logo.metamask.png',
          checked: '/assets/logos/logo.metamask.png',
          supported: '/assets/logos/logo.metamask.png',
          unchecked: '/assets/logos/logo.metamask.png',
          unsupported: '/assets/logos/logo.metamask.png',
        },
        installationURL: {
          pc: URL_INSTALL_EXTENSION.METAMASK,
          android: URL_INSTALL_ANDROID.METAMASK,
          ios: URL_INSTALL_IOS.METAMASK,
        },
        supportedDevices: {
          [NETWORK_TYPE.EVM]: ['desktop', 'smartphone', 'tablet'],
          [NETWORK_TYPE.ZK]: ['desktop'],
        },
      },
    });
  }

  getInjectedObject(): MetaMaskInpageProvider {
    if (IsServer) {
      throw new Error('Server rendering error');
    }
    // const metadata = store.getState().walletObj.metamask;
    // if (!metadata.isInjected)
    //   throw new Error(this.errorList.WALLET_NOT_INSTALLED);
    // return metadata.ethereum!!;
    if (!window || !window?.ethereum) {
      throw new Error(this.errorList.WALLET_NOT_INSTALLED);
    }
    return window.ethereum;
  }

  getProvider() {
    return new Web3(this.getInjectedObject());
  }

  async sendRequest<T = unknown>(args: RequestArguments): Promise<T> {
    return (await this.getInjectedObject().request<T>(args)) as T;
  }

  addListener(params: WalletMetamaskEvents, nwType?: NETWORK_TYPE) {
    const isZK = nwType === NETWORK_TYPE.ZK;
    const isChainChangedEv =
      params.eventName === WALLET_EVENT_NAME.CHAIN_CHANGED;
    if (isZK && isChainChangedEv) {
      const root = this;
      async function cb() {
        const [chainId] = await handleRequest(root.getNetwork(nwType));
        isChainChangedEv && params.handler(chainId || '');
      }
      return setInterval(cb, ITV.S5);
    }

    this.getInjectedObject().on(params.eventName, params.handler as any);
  }

  removeListener(e: WALLET_EVENT_NAME, nwType?: NETWORK_TYPE, id?: any) {
    const isZK = nwType === NETWORK_TYPE.ZK;
    const isChainChangedEv = e === WALLET_EVENT_NAME.CHAIN_CHANGED;
    if (isZK && isChainChangedEv && id) {
      return clearInterval(id);
    }
    this.getInjectedObject().removeAllListeners(e);
  }

  async connect(
    network: Network,
    msg: string,
    isSign?: boolean,
    onStart?: () => void,
    onFinish?: () => void,
    onError?: () => void,
    whileHandle?: () => void
  ) {
    let account: string = '';
    let signature: string | ResponseSignature = '';
    switch (network.type) {
      case NETWORK_TYPE.EVM:
        const [resAccount, errorAccount] = await handleRequest(
          this.sendRequest<string[]>({
            method: 'eth_requestAccounts',
          })
        );
        if (errorAccount)
          throw new Error(this.errorList.WALLET_CONNECT_REJECTED);
        // throw error if cannot get account
        if (
          !resAccount ||
          resAccount.length === 0 ||
          typeof resAccount[0] === 'undefined'
        ) {
          throw new Error(this.errorList.WALLET_CONNECT_FAILED);
        }
        // set account if could get correct account
        account = resAccount[0];
        if (isSign) {
          const [res, error] = await handleRequest(
            this.sendRequest<string>({
              method: 'personal_sign',
              params: [msg, account],
            })
          );
          if (error) throw new Error(this.errorList.WALLET_CONNECT_REJECTED);
          if (res) signature = res;
        }
        break;

      case NETWORK_TYPE.ZK:
        const snap = await this.sendRequest<GetSnapResponse>({
          method: 'wallet_getSnaps',
        });
        // console.log('🚀 ~ WalletMetamask ~ snap:', snap);
        const snapId: string = process.env.NEXT_PUBLIC_REQUIRED_SNAP_ID || '';
        const version: string =
          process.env.NEXT_PUBLIC_REQUIRED_SNAP_VERSION || '';

        if (!snap.hasOwnProperty(snapId) || snap[snapId].version !== version) {
          onStart && onStart();
          const [req, reqError] = await handleRequest(
            this.sendRequest({
              method: 'wallet_requestSnaps',
              params: {
                [snapId]: {
                  version: `^${version}`,
                },
              },
            })
          );
          whileHandle && whileHandle();
          if (reqError) throw reqError;
        }

        const accountInfo = await this.sendRequest<ResponseAccountInfo>({
          method: 'wallet_invokeSnap',
          params: {
            snapId,
            request: {
              method: 'mina_accountInfo',
              params: {},
            },
          },
        });
        account = accountInfo.publicKey;
        if (!isSign) break;
        const [resSnap, errorSnap] = await handleRequest(
          this.sendRequest<ResponseSignatureResult>({
            method: 'wallet_invokeSnap',
            params: {
              snapId,
              request: {
                method: 'mina_signMessage',
                params: {
                  message: msg,
                },
              },
            },
          })
        );
        if (errorSnap) throw new Error(this.errorList.WALLET_CONNECT_REJECTED);
        if (resSnap) signature = resSnap.signature;

        onFinish && onFinish();
        break;

      default:
        break;
    }
    return {
      account,
      signature,
    };
  }

  async createTx() {
    return '';
  }

  async signTx() {
    return '';
  }

  async getNetwork(nwType?: NETWORK_TYPE) {
    if (!nwType || nwType === NETWORK_TYPE.EVM)
      return this.sendRequest<string>({
        method: 'eth_chainId',
      });
    if (nwType && nwType === NETWORK_TYPE.ZK) {
      const { name } = await this.sendRequest<Promise<ResponseNetworkConfig>>({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'npm:mina-portal',
          request: {
            method: 'mina_networkConfig',
          },
        },
      });
      return name;
    }
    return '0';
  }

  async getBalance(
    network: Network,
    userAddr: string,
    asset: TokenType
  ): Promise<string> {
    const isNativeToken = network.nativeCurrency.symbol === asset.symbol;

    switch (network.type) {
      case NETWORK_TYPE.EVM:
        // native
        if (isNativeToken) {
          const provider: ProviderType = {
            type: PROVIDER_TYPE.WALLET,
            injectObject: WALLET_INJECT_OBJ.METAMASK,
          };
          const web3 = getWeb3Instance(provider);
          const [blnWei, error] = await handleRequest(
            web3.eth.getBalance(userAddr)
          );
          if (error) throw new Error(this.errorList.WALLET_GET_BALANCE_FAIL);
          return formWei(blnWei!!.toString(), asset.decimals);
        }
        return '';
      case NETWORK_TYPE.ZK:
        const { PublicKey, TokenId } = await import('o1js');
        const snapId = process.env.NEXT_PUBLIC_REQUIRED_SNAP_ID || '';
        if (isNativeToken) {
          const accountInfo = await this.sendRequest<ResponseAccountInfo>({
            method: 'wallet_invokeSnap',
            params: {
              snapId,
              request: {
                method: 'mina_accountInfo',
              },
            },
          });
          return formWei(accountInfo.balance.total, asset.decimals);
        }
        const [tokenPub, convertPubError] = handleException(
          asset.tokenAddr,
          PublicKey.fromBase58
        );

        if (convertPubError || !tokenPub) return '0';

        const [account, reqError] = await handleRequest(
          this.sendRequest<ResponseAccountInfo>({
            method: 'wallet_invokeSnap',
            params: {
              snapId,
              request: {
                method: 'mina_accountInfo',
                params: {
                  tokenId: TokenId.toBase58(TokenId.derive(tokenPub)),
                },
              },
            },
          })
        );
        // console.log('🚀 ~ WalletMetamask ~ account:', account);
        if (reqError || !account)
          throw new Error(this.errorList.WALLET_GET_BALANCE_FAIL);
        return formWei(account.balance.total, asset.decimals);

      default:
        return '';
    }
  }

  async switchNetwork(network: Network) {
    switch (network.type) {
      case NETWORK_TYPE.EVM:
        const chainId = await this.getNetwork();
        if (chainId !== network.metadata.chainId) {
          const [_, error] = await handleRequest(
            this.sendRequest({
              method: 'wallet_switchEthereumChain',
              params: [
                {
                  chainId: network.metadata.chainId,
                },
              ],
            })
          );
          if (error) {
            throw new Error(this.errorList.WALLET_USER_REJECTED);
          }
        }
        return true;
      case NETWORK_TYPE.ZK:
        const { name } = await this.sendRequest<Promise<ResponseNetworkConfig>>(
          {
            method: 'wallet_invokeSnap',
            params: {
              snapId: 'npm:mina-portal',
              request: {
                method: 'mina_networkConfig',
              },
            },
          }
        );
        if (name !== network.metadata.chainId) {
          await this.sendRequest({
            method: 'wallet_invokeSnap',
            params: {
              snapId: 'npm:mina-portal',
              request: {
                method: 'mina_changeNetwork',
                params: {
                  networkName: getZKChainIdName(network.metadata.chainId),
                },
              },
            },
          });
        }
        return true;
      default:
        return false;
    }
  }

  async watchToken(params: {
    type: 'ERC20';
    options: {
      address: string;
      symbol: string;
      decimals: number;
      image?: string;
    };
  }) {
    return await this.sendRequest({ method: 'wallet_watchAsset', params });
  }

  async sendTx(payload: any): Promise<void> {
    const snapId: string = process.env.NEXT_PUBLIC_REQUIRED_SNAP_ID || '';

    const res = await this.getInjectedObject().request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: snapId,
        request: {
          method: 'mina_sendTransaction',
          params: {
            transaction: payload.transaction,
            feePayer: {
              fee: payload.fee,
            },
          },
        },
      },
    });
    if (
      typeof res === 'string' &&
      res.includes(this.errorMessageList.UNKNOWN_MINA_SEND_TX)
    ) {
      throw new Error(this.errorList.MINA_UNKNOWN_SEND_ERROR);
    }
  }
}
