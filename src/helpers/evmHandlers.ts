import Web3 from 'web3';

import { IsServer } from '@/constants';
import { PROVIDER_TYPE, ProviderType } from '@/models/contract/evm/contract';
import { WALLET_NAME } from '@/models/wallet';
import { RootState, store } from '@/store';

const getWalletObjState = (wallet: WALLET_NAME) => {
  const globalState = store.getState() as RootState;
  return globalState.walletObj[wallet];
};
const getWalletInstanceState = () => {
  const globalState = store.getState() as RootState;
  return globalState.walletInstance.walletInstance;
};

export function getWeb3Instance(provider: ProviderType) {
  if (IsServer) {
    return new Web3(new Web3.providers.HttpProvider((provider as { type: PROVIDER_TYPE.HTTPS | PROVIDER_TYPE.HTTP; uri: string }).uri));
  }

  switch (provider.type) {
    case PROVIDER_TYPE.WALLET:
      const wallet = getWalletInstanceState();
      if (!wallet) {
        throw new Error('Please connect to a wallet');
      }
      if (wallet.metadata.InjectedObject !== provider.injectObject) {
        throw new Error('Incorrect wallet injected');
      }

      const walletObj = getWalletObjState(wallet.name);
      if (!walletObj.isInjected) {
        throw new Error(`Please install ${wallet.name} wallet`);
      }

      if (!('getProvider' in wallet))
        throw new Error(`${wallet.name} wallet is not supporting evm chains`);

      return wallet.getProvider();

    default:
      return new Web3(new Web3.providers.HttpProvider(provider.uri));
  }
}
