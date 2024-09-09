'use client';
import { useEffect, useMemo, useRef } from 'react';

import { Network } from '@/models/network';
import { NETWORK_TYPE } from '@/models/network/network';
import { Wallet } from '@/models/wallet';
import {
  WALLET_EVENT_NAME,
  WALLET_NAME,
} from '@/models/wallet/wallet.abstract';
import {
  getUISlice,
  getWalletInstanceSlice,
  store,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { BANNER_NAME, uiSliceActions } from '@/store/slices/uiSlice';
import { walletSliceActions } from '@/store/slices/walletSlice';

export default function useWalletEvents() {
  const { walletInstance, networkInstance } = useAppSelector(
    getWalletInstanceSlice
  );
  const { banners } = useAppSelector(getUISlice);
  const dispatch = useAppDispatch();
  const chainChangedRef = useRef<any>(null);

  const bannerUnmatchedChain = useMemo(
    () => banners[BANNER_NAME.UNMATCHED_CHAIN_ID],
    [banners]
  );

  async function checkMatchedNetwork(wallet: Wallet, nw: Network) {
    const curChain = await wallet.getNetwork(nw.type);

    if (curChain.toLowerCase() !== nw.metadata.chainId.toLowerCase())
      return dispatch(
        uiSliceActions.openBanner({
          bannerName: BANNER_NAME.UNMATCHED_CHAIN_ID,
          payload: {
            chainId: curChain,
          },
        })
      );
    if (bannerUnmatchedChain.isDisplay)
      return dispatch(
        uiSliceActions.closeBanner({
          bannerName: BANNER_NAME.UNMATCHED_CHAIN_ID,
        })
      );
    return;
  }

  // native event
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

    const isSnap =
      walletInstance.name === WALLET_NAME.METAMASK &&
      networkInstance.src.type === NETWORK_TYPE.ZK;

    walletInstance.addListener({
      eventName: WALLET_EVENT_NAME.ACCOUNTS_CHANGED,
      handler(accounts) {
        if (isSnap) return;
        if (accounts && accounts.length > 0) {
          return dispatch(walletSliceActions.updateAccount(accounts[0]));
        }
        return dispatch(walletSliceActions.disconnect());
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
            chainId.toLowerCase() !==
            networkInstance.src.metadata.chainId.toLowerCase()
          )
            return dispatch(
              uiSliceActions.openBanner({
                bannerName: BANNER_NAME.UNMATCHED_CHAIN_ID,
                payload: {
                  chainId,
                },
              })
            );
          const isBannerDisplayed =
            store.getState().ui.banners[BANNER_NAME.UNMATCHED_CHAIN_ID]
              .isDisplay;

          if (isBannerDisplayed)
            return dispatch(
              uiSliceActions.closeBanner({
                bannerName: BANNER_NAME.UNMATCHED_CHAIN_ID,
              })
            );
          return;
        },
      },
      isSnap ? networkInstance.src.type : undefined
    );
    walletInstance.addListener({
      eventName: WALLET_EVENT_NAME.DISCONNECT,
      handler(error) {
        console.log('🚀 ~ handler ~ error:', error);
        if (isSnap) return;
        return dispatch(walletSliceActions.disconnect());
      },
    });
    walletInstance.addListener({
      eventName: WALLET_EVENT_NAME.MESSAGE,
      handler(message) {
        console.log('🚀 ~ handler ~ error:', message);
      },
    });
    return () => {
      walletInstance.removeListener(WALLET_EVENT_NAME.ACCOUNTS_CHANGED);
      walletInstance.removeListener(
        WALLET_EVENT_NAME.CHAIN_CHANGED,
        isSnap ? networkInstance.src?.type : undefined,
        isSnap ? chainChangedRef.current : undefined
      );
      chainChangedRef.current = null;
      walletInstance.removeListener(WALLET_EVENT_NAME.DISCONNECT);
      walletInstance.removeListener(WALLET_EVENT_NAME.MESSAGE);
    };
  }, [walletInstance, networkInstance.src]);
}
