'use client';
import {
  Button,
  ButtonProps,
  Flex,
  FlexProps,
  Image,
  Text,
} from '@chakra-ui/react';

import { useModalSNState } from '../context';

import useNotifier from '@/hooks/useNotifier';
import NETWORKS, { NETWORK_NAME } from '@/models/network';
import WALLETS, { WALLET_NAME } from '@/models/wallet';
import { WALLET_EVENT_NAME } from '@/models/wallet/wallet.abstract';
import {
  getWalletInstanceSlice,
  getWalletSlice,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { persistSliceActions } from '@/store/slices/persistSlice';
import { walletSliceActions } from '@/store/slices/walletSlice';

type CardProps = { nwKey: NETWORK_NAME };

export default function Card({ nwKey }: CardProps) {
  const dispatch = useAppDispatch();
  const { networkName, isConnected } = useAppSelector(getWalletSlice);
  const { walletInstance } = useAppSelector(getWalletInstanceSlice);

  const { curNetworkKey } = useModalSNState().constants;
  const { hasSupportedNetwork, handleCloseCurModal } =
    useModalSNState().methods;

  const { sendNotification } = useNotifier();

  const network = NETWORKS[nwKey];
  const isSelected = networkName[curNetworkKey] === nwKey;

  async function handleSelectNetwork() {
    if (isSelected) return handleCloseCurModal();

    if (!isConnected) {
      handleCloseCurModal();
      dispatch(persistSliceActions.setLastNetworkName(network.name));
      return;
    }

    handleCloseCurModal();

    WALLETS[
      network.name === NETWORK_NAME.ETHEREUM
        ? WALLET_NAME.METAMASK
        : WALLET_NAME.AURO
    ]?.switchNetwork(network);

    // retry get wallet account
    const res = await dispatch(
      walletSliceActions.connectWallet({
        wallet:
          WALLETS[
            network.name === NETWORK_NAME.ETHEREUM
              ? WALLET_NAME.METAMASK
              : WALLET_NAME.AURO
          ]!,
        network,
        isSign: true,
      })
    );
    //  when fail to connect
    if (walletSliceActions.connectWallet.rejected.match(res)) {
      sendNotification({
        toastType: 'error',
        options: {
          title: res.error.message || null,
        },
      });
    }
  }

  const containerProps: ButtonProps = {
    w: 'full',
    h: '70px',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    bg: !isSelected
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
    bg: 'text.25',
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
