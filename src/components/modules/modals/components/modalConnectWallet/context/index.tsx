'use client';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { MODAL_NAME } from '@/configs/modal';
import ROUTES from '@/configs/routes';
import { handleRequest } from '@/helpers/asyncHandlers';
import useNotifier from '@/hooks/useNotifier';
import NETWORKS, { NETWORK_NAME, Network } from '@/models/network';
import WALLETS, { WALLET_NAME, Wallet } from '@/models/wallet';
import {
  getPersistSlice,
  getUISlice,
  getWalletObjSlice,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { TITLE, uiSliceActions } from '@/store/slices/uiSlice';
import { walletSliceActions } from '@/store/slices/walletSlice';

export type ModalCWState = {
  status: {
    isScreenLoading: boolean;
    isSnapInstalling: boolean;
  };
  isAcceptTerm: boolean;
  selectedNetwork: NETWORK_NAME;
  selectedWallet?: WALLET_NAME;
};

export type ModalCWCtxValueType = {
  state: ModalCWState;
  methods: {
    onSelectNetwork: (net: NETWORK_NAME) => void;
    onSelectWallet: (wallet: WALLET_NAME) => void;
    onToggleAcceptTerm: () => void;
  };
};
export type ModalCWProviderProps = React.PropsWithChildren<{
  modalName: MODAL_NAME;
}>;

export const initModalCWState: ModalCWState = {
  status: {
    isScreenLoading: false,
    isSnapInstalling: false,
  },
  isAcceptTerm: false,
  selectedNetwork: NETWORK_NAME.MINA,
};

export const ModalCWContext = React.createContext<ModalCWCtxValueType | null>(
  null
);

export function useModalCWState() {
  return React.useContext(ModalCWContext) as ModalCWCtxValueType;
}

export default function ModalCWProvider({
  children,
  modalName,
}: ModalCWProviderProps) {
  const dispatch = useAppDispatch();
  const { sendNotification } = useNotifier();
  const [state, setState] = useState<ModalCWState>(initModalCWState);
  const { lastNetworkName } = useAppSelector(getPersistSlice);

  const walletObjects = useAppSelector(getWalletObjSlice);
  const { modals } = useAppSelector(getUISlice);

  const router = useRouter();

  const curModal = useMemo(() => modals[modalName], [modals, modalName]);

  const onToggleAcceptTerm = useCallback(() => {
    setState((prev) => ({ ...prev, isAcceptTerm: !prev.isAcceptTerm }));
  }, [setState]);

  const handleCloseModal = useCallback(() => {
    dispatch(uiSliceActions.closeModal({ modalName }));
  }, [modalName, dispatch]);

  const onSelectNetwork = useCallback(
    (net: NETWORK_NAME) => {
      setState(({ selectedWallet, ...prev }) => ({
        ...prev,
        selectedNetwork: net,
      }));
    },
    [setState]
  );

  const switchNetwork = useCallback(
    async (wallet: Wallet, network: Network) => {
      const [res, error] = await handleRequest(wallet.switchNetwork(network));
      if (error) {
        console.error(error);
        return;
      }
    },
    []
  );

  const openConnectWalletErrorModal = useCallback(
    (walletName: WALLET_NAME) => {
      dispatch(
        uiSliceActions.openModal({
          modalName: MODAL_NAME.CONNECT_WALLET_ERROR,
          payload: { walletName },
        })
      );
    },
    [dispatch]
  );

  const openCWSuccessModal = useCallback(() => {
    dispatch(
      uiSliceActions.openModal({
        modalName: MODAL_NAME.SUCCESS_ACTION,
        payload: {
          title: TITLE.CONNECT_WALLET_SUCCESS,
        },
      })
    );
  }, [dispatch]);

  const updateScreenLoading = useCallback(
    (value: boolean) =>
      setState((prev) => ({
        ...prev,
        status: {
          ...prev.status,
          isScreenLoading: value,
        },
      })),
    [setState]
  );

  const updateSnapLoading = useCallback(
    (value: boolean) =>
      setState((prev) => ({
        ...prev,
        status: {
          ...prev.status,
          isSnapInstalling: value,
        },
      })),
    [setState]
  );

  const onSelectWallet = useCallback(
    async (wallet: WALLET_NAME) => {
      updateScreenLoading(true);
      const walletObj = walletObjects[wallet];
      if (!walletObj.isInjected) {
        handleCloseModal();
        openConnectWalletErrorModal(wallet);
        return;
      }
      setState((prev) => ({
        ...prev,
        selectedWallet: wallet,
      }));

      const needSnapInstall =
        wallet === WALLET_NAME.METAMASK &&
        state.selectedNetwork === NETWORK_NAME.MINA;

      const res = await dispatch(
        walletSliceActions.connectWallet({
          wallet: WALLETS[wallet]!!,
          network: NETWORKS[state.selectedNetwork],
          isSign: true,
          onCnStart: () => {
            if (needSnapInstall) {
              // console.log('start loading install');

              updateSnapLoading(true);
            }
          },
          whileCnHandle() {
            if (needSnapInstall) {
              updateSnapLoading(false);
            }
          },
        })
      );
      await switchNetwork(WALLETS[wallet]!!, NETWORKS[state.selectedNetwork]);

      updateScreenLoading(false);

      handleCloseModal();
      if (walletSliceActions.connectWallet.fulfilled.match(res)) {
        openCWSuccessModal();
        router.push(ROUTES.HISTORY);
      }
      if (walletSliceActions.connectWallet.rejected.match(res)) {
        console.error(res.error);
        sendNotification({
          toastType: 'error',
          options: {
            title: res.error.message,
          },
        });
      }
    },
    [
      state.selectedNetwork,
      setState,
      walletObjects,
      handleCloseModal,
      switchNetwork,
      openCWSuccessModal,
      openConnectWalletErrorModal,
      dispatch,
      sendNotification,
      updateScreenLoading,
      updateSnapLoading,
    ]
  );

  // default network must follow global state and reset state on close
  useEffect(() => {
    if (!curModal.isOpen || !lastNetworkName) return;
    setState({
      status: {
        isScreenLoading: false,
        isSnapInstalling: false,
      },
      isAcceptTerm: false,
      selectedNetwork: lastNetworkName,
    });
  }, [curModal.isOpen, lastNetworkName]);

  const value = useMemo<ModalCWCtxValueType>(
    () => ({
      state,
      methods: { onSelectNetwork, onSelectWallet, onToggleAcceptTerm },
    }),
    [state, onSelectNetwork, onSelectWallet, onToggleAcceptTerm]
  );

  return (
    <ModalCWContext.Provider value={value}>{children}</ModalCWContext.Provider>
  );
}
