import { useEffect, useRef } from 'react';

import ITV from '@/configs/time';
import { getWalletObjSlice, useAppDispatch, useAppSelector } from '@/store';
import { walletObjSliceActions } from '@/store/slices/walletObjSlice';

const maxIntervalPeriod = 5000;
const ANNOUNCE_PROVIDER_EVENT = 'eip6963:announceProvider';
const REQUEST_PROVIDER_EVENT = 'eip6963:requestProvider';

export default function useWeb3Injected() {
  const dispatch = useAppDispatch();
  const { metamask, auro } = useAppSelector(getWalletObjSlice);
  const interval = useRef<any>(null);
  const intervalPeriod = useRef<number>(0);

  // Multi inject provider (Metamask / Trust wallet / ...)
  useEffect(() => {
    const handleProvider = (event: any) => {
      const provider = event.detail.provider;

      if (
        provider.isPhantom ||
        provider.isRabby ||
        provider.isTrust ||
        provider.isCoinbaseWallet ||
        provider.isStarKeyWallet ||
        provider.isRainbow ||
        provider.isBraveWallet ||
        provider.isOpera
      ) {
        return;
      }

      if (provider.isMetaMask) {
        console.log('🚀 ~ Exist metamask inject provider! ~:', provider);
        dispatch(walletObjSliceActions.injectMetamask({ ethereum: provider }));
        return;
      }
    };
    window.addEventListener(ANNOUNCE_PROVIDER_EVENT, handleProvider);
    window.dispatchEvent(new Event(REQUEST_PROVIDER_EVENT));

    return () => {
      window.removeEventListener('eip6963:announceProvider', handleProvider);
    };
  }, []);

  //   Detecting web3 or ethereum injected
  useEffect(() => {
    interval.current = setInterval(() => {
      intervalPeriod.current += ITV.MS1;
      // if (window.ethereum) {
      //   dispatch(
      //     walletObjSliceActions.injectMetamask({ ethereum: window.ethereum })
      //   );
      // }
      if (window.mina) {
        dispatch(walletObjSliceActions.injectMina({ mina: window.mina }));
      }
      if (intervalPeriod.current === maxIntervalPeriod) {
        clearInterval(interval.current);
        interval.current = null;
      }
    }, ITV.MS1);
    return () => {
      clearInterval(interval.current);
    };
  }, []);

  //   clearInterval if injected
  useEffect(() => {
    if (metamask.isInjected && auro.isInjected && interval.current)
      clearInterval(interval.current);
  }, [metamask.isInjected, auro.isInjected]);

  return;
}
