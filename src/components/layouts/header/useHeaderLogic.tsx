'use client';
import { AspectRatio, ButtonProps, Image, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import { MODAL_NAME } from '@/configs/modal';
import ROUTES from '@/configs/routes';
import { truncateMid } from '@/helpers/common';
import NETWORKS from '@/models/network';
import {
  getPersistSlice,
  getWalletInstanceSlice,
  getWalletSlice,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { uiSliceActions } from '@/store/slices/uiSlice';
import { NETWORK_KEY, walletSliceActions } from '@/store/slices/walletSlice';

export default function useHeaderLogic(extractFnc: boolean = false) {
  const dispatch = useAppDispatch();
  const { lastNetworkName } = useAppSelector(getPersistSlice);
  const { walletInstance } = useAppSelector(getWalletInstanceSlice);
  const { isConnected, address } = useAppSelector(getWalletSlice);

  const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);
  const router = useRouter();

  const toggleMenu = useCallback(() => {
    if (address) {
      setIsMenuOpened((prev) => !prev);
    }
  }, [address, setIsMenuOpened]);

  const closeMenu = useCallback(() => {
    setIsMenuOpened(false);
  }, [setIsMenuOpened]);

  const disconnectWallet = useCallback(() => {
    if (!address) return;
    dispatch(walletSliceActions.disconnect());
    router.push(ROUTES.HOME);

    closeMenu();
  }, [dispatch, address, closeMenu, router]);

  const openConnectWalletModal = useCallback(() => {
    dispatch(
      uiSliceActions.openModal({ modalName: MODAL_NAME.CONNECT_WALLET })
    );
  }, [dispatch]);

  const openSelectNetworkModal = useCallback(() => {
    dispatch(
      uiSliceActions.openModal({
        modalName: MODAL_NAME.SELECT_NETWORK,
        payload: {
          networkKey: NETWORK_KEY.SRC,
          isValidate: true,
        },
      })
    );
  }, [dispatch]);

  const btnSelectNetworkProps = useMemo<ButtonProps>(() => {
    if (!lastNetworkName) return { variant: '_blank', children: null };
    const nw = NETWORKS[lastNetworkName];
    return {
      leftIcon: (
        <AspectRatio w={'24px'} h={'24px'} ratio={1}>
          <Image src={nw.metadata.logo.header} />
        </AspectRatio>
      ),
      iconSpacing: 0,
      onClick: openSelectNetworkModal,
      children: (
        <>
          <Text textTransform={'capitalize'}>{nw.name} Network</Text>
          <Image
            src={'/assets/icons/icon.arrow.down.svg'}
            w={'16px'}
            h={'16px'}
          />
        </>
      ),
    };
  }, [lastNetworkName, openSelectNetworkModal]);

  const btnConnectWalletProps = useMemo<ButtonProps>(() => {
    // if extract function only, this jsx is redundant
    if (extractFnc) return <></>;

    // when no wallet connected
    if (!isConnected)
      return {
        variant: 'primary.orange.solid',
        onClick: openConnectWalletModal,
        children: 'Connect Wallet',
      };

    // when have a wallet connect
    const [fSlice, sSlice] = truncateMid(address!!, 4, 4); // truncate adddress

    return {
      variant: 'primary.orange',
      leftIcon: (
        <AspectRatio w={'24px'} h={'24px'} ratio={1}>
          <Image src={walletInstance?.metadata.logo.base} />
        </AspectRatio>
      ),
      onClick: toggleMenu,
      iconSpacing: 0,
      children: fSlice + '...' + sSlice,
    };
  }, [
    openConnectWalletModal,
    toggleMenu,
    walletInstance,
    address,
    isConnected,
    extractFnc,
  ]);

  return {
    isMenuOpened,
    disconnectWallet,
    closeMenu,
    btnConnectWalletProps,
    openConnectWalletModal,
    btnSelectNetworkProps,
    openSelectNetworkModal,
  };
}
