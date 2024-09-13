import { useEffect } from 'react';

import { Network } from '@/models/network';
import { getZKChainIdName } from '@/models/network/network';
import { Wallet } from '@/models/wallet';
import { WALLET_EVENT_NAME } from '@/models/wallet/wallet.abstract';
import {
  getWalletInstanceSlice,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { BANNER_NAME, uiSliceActions } from '@/store/slices/uiSlice';
import { walletSliceActions } from '@/store/slices/walletSlice';

export default function useWalletEvents() {
  const { walletInstance, networkInstance } = useAppSelector(
    getWalletInstanceSlice
  );
  const dispatch = useAppDispatch();

  async function checkMatchedNetwork(wallet: Wallet, nw: Network) {
    const curChain = await wallet.getNetwork(nw.type);

    console.log({
      curChain: curChain,
      nw: nw.metadata,
      // get: getZKChainIdName(nw.metadata.chainId).toLowerCase(),
    });

    if (curChain.toLowerCase() !== nw.metadata.chainId.toLowerCase())
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

    walletInstance.addListener({
      eventName: WALLET_EVENT_NAME.ACCOUNTS_CHANGED,
      handler(accounts) {
        if (accounts && accounts.length > 0) {
          return dispatch(walletSliceActions.updateAccount(accounts[0]));
        }
        return dispatch(walletSliceActions.disconnect());
      },
    });
    // display banner when listener was not initialize
    checkMatchedNetwork(walletInstance, networkInstance.src);
    // initialize network chain listener
    walletInstance.addListener({
      eventName: WALLET_EVENT_NAME.CHAIN_CHANGED,
      handler(chain) {
        if (!chain) return dispatch(walletSliceActions.disconnect());
        if (!networkInstance.src) return;

        const chainId = typeof chain === 'string' ? chain : chain.networkID;

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
        return dispatch(
          uiSliceActions.closeBanner({
            bannerName: BANNER_NAME.UNMATCHED_CHAIN_ID,
          })
        );
      },
    });
    walletInstance.addListener({
      eventName: WALLET_EVENT_NAME.DISCONNECT,
      handler(error) {
        console.log('🚀 ~ handler ~ error:', error);
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
      walletInstance.removeListener(WALLET_EVENT_NAME.CHAIN_CHANGED);
      walletInstance.removeListener(WALLET_EVENT_NAME.DISCONNECT);
      walletInstance.removeListener(WALLET_EVENT_NAME.MESSAGE);
    };
  }, [walletInstance, networkInstance.src]);
}
