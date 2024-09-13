'use client';
import { Flex, FlexProps, Image, Text } from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';

import { MODAL_NAME } from '@/configs/modal';
import useNotifier from '@/hooks/useNotifier';
import NETWORKS, { NETWORK_NAME } from '@/models/network';
import { WALLET_NAME } from '@/models/wallet';
import {
  getUISlice,
  getWalletInstanceSlice,
  getWalletSlice,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { uiSliceActions } from '@/store/slices/uiSlice';
import { NETWORK_KEY, walletSliceActions } from '@/store/slices/walletSlice';

type Params = {
  modalName: MODAL_NAME;
};

const networkOrder = [NETWORK_NAME.MINA, NETWORK_NAME.ETHEREUM];

export default function useModalSNLogic({ modalName }: Params) {
  const { sendNotification } = useNotifier();
  const dispatch = useAppDispatch();
  const { networkName, isConnected } = useAppSelector(getWalletSlice);
  const { walletInstance } = useAppSelector(getWalletInstanceSlice);
  const { modals } = useAppSelector(getUISlice);

  const curModal = useMemo(() => modals[modalName], [modalName, modals]);
  const modalPayload = useMemo(() => curModal.payload, [curModal]);

  const curNetworkKey = useMemo(() => {
    if (!modalPayload || !('networkKey' in modalPayload))
      return NETWORK_KEY.SRC;
    return modalPayload.networkKey;
  }, [modalPayload]);

  const handleCloseModal = useCallback(
    (modal: MODAL_NAME) => {
      dispatch(uiSliceActions.closeModal({ modalName: modal }));
    },
    [dispatch]
  );

  const isSupportedNetwork = useCallback(
    (key: NETWORK_NAME) => {
      if (
        !modalPayload ||
        !('isValidate' in modalPayload) ||
        !modalPayload.isValidate ||
        !walletInstance
      )
        return true;
      return walletInstance.metadata.supportedNetwork.includes(key);
    },
    [isConnected, networkName, modalPayload, walletInstance]
  );

  const handleOpenLoadingModal = useCallback(() => {
    dispatch(
      uiSliceActions.openModal({
        modalName: MODAL_NAME.LOADING,
        payload: { titleLoading: 'Waiting for confirmation' },
      })
    );
  }, [dispatch]);

  const cardNetworkRender = useMemo(() => {
    return networkOrder.map((key) => {
      const network = NETWORKS[key];
      const isSelected = networkName[curNetworkKey] === key;

      async function handleSelectNetwork() {
        if (!isSupportedNetwork(key)) return;

        if (isSelected) {
          sendNotification({
            toastType: 'warning',
            options: {
              title: 'Use have already choose this network',
            },
          });
          return;
        }

        handleCloseModal(MODAL_NAME.SELECT_NETWORK);
        if (walletInstance && walletInstance.name === WALLET_NAME.METAMASK) {
          handleOpenLoadingModal();

          // retry get wallet account
          const res = await dispatch(
            walletSliceActions.connectWallet({
              wallet: walletInstance,
              network,
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
            handleCloseModal(MODAL_NAME.LOADING);
            return;
          }
          handleCloseModal(MODAL_NAME.LOADING);
          //  add logic for connection fail please, ex: user rejected
          return;
        }
        // unnecessary code because only Metamask can be change Network
        const res = await dispatch(
          walletSliceActions.changeNetwork({
            key: curNetworkKey,
            network: network,
          })
        );
        if (walletSliceActions.changeNetwork.rejected.match(res)) {
          sendNotification({
            toastType: 'error',
            options: {
              title: res.error.message || null,
            },
          });
        }
        // To do: Check if fail to connect Wallet (not have any docs)
        handleCloseModal(MODAL_NAME.LOADING);
      }

      const containerProps: FlexProps = {
        w: 'full',
        h: '70px',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '10px',
        cursor: isSupportedNetwork(key) ? 'pointer' : 'default',
        bg: !isSupportedNetwork(key)
          ? 'text.100'
          : !isSelected
            ? 'text.500'
            : 'linear-gradient(270deg, #DE622E 0%, #8271F0 100%)',
        mb: '22px',
        onClick: handleSelectNetwork,
      };
      const borderWidth = isSelected ? 2 : 1;

      const contentProps: FlexProps = {
        w: `calc(100% - ${borderWidth * 2}px)`,
        h: `calc(100% - ${borderWidth * 2}px)`,
        padding: '16px 19px',
        borderRadius: 10 - borderWidth + 'px',
        bg: isSupportedNetwork(key) ? 'white' : 'text.100',
        justifyContent: 'space-between',
        alignItems: 'center',
        _hover: {
          bg: 'text.100',
        },
      };

      return (
        <Flex key={key} {...containerProps}>
          <Flex {...contentProps}>
            <Image w={'36px'} h={'36px'} src={network.metadata.logo.base} />
            <Text textTransform={'capitalize'} variant={'xl_semiBold'}>
              {network.name} Network
            </Text>
          </Flex>
        </Flex>
      );
    });
  }, [
    dispatch,
    handleCloseModal,
    networkName,
    walletInstance,
    isSupportedNetwork,
    curNetworkKey,
    handleOpenLoadingModal,
    sendNotification,
  ]);

  return { cardNetworkRender };
}
