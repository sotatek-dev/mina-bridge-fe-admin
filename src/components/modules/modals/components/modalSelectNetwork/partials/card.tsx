'use client';
import {
  Button,
  ButtonProps,
  Flex,
  FlexProps,
  Image,
  Text,
} from '@chakra-ui/react';
import { useRef } from 'react';

import { useModalSNState } from '../context';

import useNotifier from '@/hooks/useNotifier';
import NETWORKS, { NETWORK_NAME } from '@/models/network';
import { WALLET_NAME } from '@/models/wallet';
import {
  getWalletInstanceSlice,
  getWalletSlice,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { NETWORK_KEY, walletSliceActions } from '@/store/slices/walletSlice';

type CardProps = { nwKey: NETWORK_NAME };

export default function Card({ nwKey }: CardProps) {
  const dispatch = useAppDispatch();
  const { networkName, isConnected } = useAppSelector(getWalletSlice);
  const { walletInstance } = useAppSelector(getWalletInstanceSlice);

  const { curNetworkKey } = useModalSNState().constants;
  const {
    hasSupportedNetwork,
    handleCloseCurModal,
    handleCloseLoadingModal,
    handleOpenLoadingModal,
  } = useModalSNState().methods;

  const { sendNotification, checkNotifyActive } = useNotifier();
  const curNotifyRef = useRef<any>(null);

  const network = NETWORKS[nwKey];
  const isSelected = networkName[curNetworkKey] === nwKey;

  async function handleSelectNetwork() {
    if (isSelected) return handleCloseCurModal();

    if (!hasSupportedNetwork(nwKey)) {
      switch (curNetworkKey) {
        case NETWORK_KEY.SRC:
          // prevent duplicate toast
          if (
            curNotifyRef.current !== null &&
            checkNotifyActive(curNotifyRef.current)
          )
            return;

          curNotifyRef.current = sendNotification({
            toastType: 'warning',
            options: {
              title:
                "Your wallet doesn't support this network. Please change the wallet connected",
            },
          });
          return;
        default:
          return;
      }
    }

    handleCloseCurModal();
    if (walletInstance && walletInstance.name === WALLET_NAME.METAMASK) {
      handleOpenLoadingModal();

      // retry get wallet account
      const res = await dispatch(
        walletSliceActions.connectWallet({
          wallet: walletInstance,
          network: network,
          isSign: true,
        })
      );
      if (walletSliceActions.connectWallet.rejected.match(res)) {
        sendNotification({
          toastType: 'error',
          options: {
            title: res.error.message || null,
          },
        });
        handleCloseLoadingModal();
        return;
      }
      handleCloseLoadingModal();
      //  add logic for connection fail please, ex: user rejected
      return;
    }
  }

  const containerProps: ButtonProps = {
    w: 'full',
    h: '70px',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    cursor: hasSupportedNetwork(nwKey) ? 'pointer' : 'not-allowed',
    bg: !hasSupportedNetwork(nwKey)
      ? 'text.100'
      : !isSelected
        ? 'text.500'
        : 'linear-gradient(270deg, #DE622E 0%, #8271F0 100%)',
    mb: '22px',
    onClick: handleSelectNetwork,
    _active: {
      boxShadow: hasSupportedNetwork(nwKey) ? '0 0 0 3px #8271F04D' : '',
    },
  };

  const borderWidth = isSelected ? 2 : 1;

  const contentProps: FlexProps = {
    w: `calc(100% - ${borderWidth * 2}px)`,
    h: `calc(100% - ${borderWidth * 2}px)`,
    padding: '16px 19px',
    borderRadius: 10 - borderWidth + 'px',
    bg: hasSupportedNetwork(nwKey) ? 'white' : 'text.100',
    justifyContent: 'space-between',
    alignItems: 'center',
    _hover: {
      bg: 'text.100',
    },
  };

  return (
    <Button variant={'_blank'} key={nwKey} {...containerProps}>
      <Flex {...contentProps}>
        <Image w={'36px'} h={'36px'} src={network.metadata.logo.base} />
        <Text textTransform={'capitalize'} variant={'xl_semiBold'}>
          {network.name} Network
        </Text>
      </Flex>
    </Button>
  );
}
