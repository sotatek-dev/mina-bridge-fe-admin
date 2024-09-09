import { useEffect } from 'react';

import useNotifier from './useNotifier';

import { WALLET_NAME } from '@/models/wallet';
import {
  getWalletInstanceSlice,
  getWalletObjSlice,
  getWalletSlice,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { walletSliceActions } from '@/store/slices/walletSlice';

export default function useLoadWalletInstances() {
  const dispatch = useAppDispatch();
  const { auro, metamask } = useAppSelector(getWalletObjSlice);
  const { walletKey } = useAppSelector(getWalletSlice);
  const { walletInstance } = useAppSelector(getWalletInstanceSlice);
  const { sendNotification } = useNotifier();

  async function reconnectWallet() {
    const res = await dispatch(walletSliceActions.reconnectWallet());
    if (!res.payload) {
      sendNotification({
        toastType: 'error',
        options: {
          title: 'User rejected',
        },
      });
    }
  }

  async function rehydrateNetworkInstance() {
    await dispatch(walletSliceActions.rehydrateNetworkInstance());
  }

  useEffect(() => {
    rehydrateNetworkInstance();
  }, []);

  useEffect(() => {
    if (!walletKey || walletInstance) return;

    // check auro wallet object is injected
    if (walletKey === WALLET_NAME.AURO && auro.isInjected) reconnectWallet();

    // check metamask wallet object is injected
    if (walletKey === WALLET_NAME.METAMASK && metamask.isInjected)
      reconnectWallet();
  }, [walletKey, auro, metamask, walletInstance]);
}
