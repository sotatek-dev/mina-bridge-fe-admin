import { EIP6963ProviderInfo } from '@metamask/providers';
import { useEffect, useRef } from 'react';

import ITV from '@/configs/time';
import { getWalletObjSlice, useAppDispatch, useAppSelector } from '@/store';
import { walletObjSliceActions } from '@/store/slices/walletObjSlice';

const maxIntervalPeriod = 5000;
const ANNOUNCE_PROVIDER_EVENT = 'eip6963:announceProvider';
const REQUEST_PROVIDER_EVENT = 'eip6963:requestProvider';
const RDNS = {
  METAMASK: ['io.metamask', 'io.metamask.mobile'],
  // ...define rdns of other wallet
};

export default function useWeb3Injected() {
  const dispatch = useAppDispatch();
  const { metamask, auro } = useAppSelector(getWalletObjSlice);
  const interval = useRef<any>(null);
  const intervalPeriod = useRef<number>(0);

  //   Check multi wallet injected provider (Metamask / Trust wallet / ...)
  useEffect(() => {
    const handleProvider = (event: any) => {
      const { provider, info } = event?.detail;
      if (RDNS.METAMASK.includes((info as EIP6963ProviderInfo).rdns)) {
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
