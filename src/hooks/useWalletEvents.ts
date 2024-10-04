import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import useNotifier from './useNotifier';

import ROUTES from '@/configs/routes';
import { Network } from '@/models/network';
import { getZKChainIdName, NETWORK_NAME } from '@/models/network/network';
import { Wallet, WALLET_NAME } from '@/models/wallet';
import { WALLET_EVENT_NAME } from '@/models/wallet/wallet.abstract';
import {
  getWalletInstanceSlice,
  getWalletSlice,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { BANNER_NAME, uiSliceActions } from '@/store/slices/uiSlice';
import { walletSliceActions } from '@/store/slices/walletSlice';

export default function useWalletEvents() {
  const chainChangedRef = useRef<any>(null);
  const { sendNotification } = useNotifier();

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { walletKey, networkName } = useAppSelector(getWalletSlice);
  const { walletInstance, networkInstance } = useAppSelector(
    getWalletInstanceSlice
  );

  const isMinaSnap =
    walletKey === WALLET_NAME.METAMASK && networkName.src === NETWORK_NAME.MINA;

  async function checkMatchedNetwork(wallet: Wallet, nw: Network) {
    const curChain = await wallet.getNetwork(nw.type);

    if (
      isMinaSnap
        ? curChain.toLowerCase() !==
          getZKChainIdName(nw.metadata.chainId).toLowerCase()
        : curChain.toLowerCase() !== nw.metadata.chainId.toLowerCase()
    )
      return dispatch(
        uiSliceActions.openBanner({
          bannerName: BANNER_NAME.UNMATCHED_CHAIN_ID,
          payload: {
            chainId: curChain,
          },
        })
      );

    return dispatch(
      uiSliceActions.closeBanner({
        bannerName: BANNER_NAME.UNMATCHED_CHAIN_ID,
      })
    );
  }

  useEffect(() => {
    if (!walletInstance || !networkInstance.src) return;

    // remove interval listener when wallet or network change
    if (chainChangedRef.current) {
      walletInstance.removeListener(
        WALLET_EVENT_NAME.CHAIN_CHANGED,
        chainChangedRef.current
      );
      chainChangedRef.current = null;
    }

    walletInstance.addListener({
      eventName: WALLET_EVENT_NAME.ACCOUNTS_CHANGED,
      handler(accounts) {
        if (isMinaSnap) return;
        // if (accounts && accounts.length > 0) {
        //   return dispatch(walletSliceActions.updateAccount(accounts[0]));
        // }

        // Switch account is not admin's address
        sendNotification({
          toastType: 'error',
          options: {
            title: 'Signature invalid',
          },
        });
        dispatch(walletSliceActions.disconnect());
        return router.replace(ROUTES.HOME);
      },
    });
    // display banner when listener was not initialize
    checkMatchedNetwork(walletInstance, networkInstance.src);

    // initialize network chain listener
    chainChangedRef.current = walletInstance.addListener(
      {
        eventName: WALLET_EVENT_NAME.CHAIN_CHANGED,
        handler(chain) {
          if (!chain) return dispatch(walletSliceActions.disconnect());
          if (!networkInstance.src) return;

          // Fix: chain?.chainId or chain?.networkID
          const chainId = typeof chain === 'string' ? chain : chain?.networkID;

          if (
            walletKey === WALLET_NAME.AURO
              ? chainId.toLowerCase() !== networkInstance.src.metadata.chainId
              : chainId.toLowerCase() !==
                getZKChainIdName(
                  networkInstance.src.metadata.chainId
                ).toLowerCase()
          )
            return dispatch(
              uiSliceActions.openBanner({
                bannerName: BANNER_NAME.UNMATCHED_CHAIN_ID,
                payload: {
                  chainId,
                },
              })
            );

          return dispatch(
            uiSliceActions.closeBanner({
              bannerName: BANNER_NAME.UNMATCHED_CHAIN_ID,
            })
          );
        },
      },
      isMinaSnap ? networkInstance.src.type : undefined
    );
    walletInstance.addListener({
      eventName: WALLET_EVENT_NAME.DISCONNECT,
      handler(error) {
        if (isMinaSnap) return;
        console.error(error);
        return dispatch(walletSliceActions.disconnect());
      },
    });
    walletInstance.addListener({
      eventName: WALLET_EVENT_NAME.MESSAGE,
      handler(message) {
        // console.log('🚀 ~ handler ~ error:', message);
        console.log(message);
      },
    });
    return () => {
      walletInstance.removeListener(WALLET_EVENT_NAME.ACCOUNTS_CHANGED);
      walletInstance.removeListener(
        WALLET_EVENT_NAME.CHAIN_CHANGED,
        isMinaSnap ? networkInstance.src?.type : undefined,
        isMinaSnap ? chainChangedRef.current : undefined
      );
      chainChangedRef.current = null;
      walletInstance.removeListener(WALLET_EVENT_NAME.DISCONNECT);
      walletInstance.removeListener(WALLET_EVENT_NAME.MESSAGE);
    };
  }, [walletInstance, networkInstance.src]);
}
