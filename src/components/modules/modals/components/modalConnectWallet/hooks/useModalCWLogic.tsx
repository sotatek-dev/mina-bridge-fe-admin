'use client';
import { ButtonProps } from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';

import { useModalCWState } from '../context';
import Card, { CARD_STATUS } from '../partials/card';

import NETWORKS, { NETWORK_NAME } from '@/models/network';
import WALLETS, { WALLET_NAME, Wallet } from '@/models/wallet';
import { getPersistSlice, getWalletSlice, useAppSelector } from '@/store';

const networkOrder = [NETWORK_NAME.MINA, NETWORK_NAME.ETHEREUM];
const walletOrder = [WALLET_NAME.METAMASK, WALLET_NAME.AURO];

export default function useModalCWLogic() {
  const { state, methods } = useModalCWState();
  const { userDevice } = useAppSelector(getPersistSlice);
  const { isConnected, networkName } = useAppSelector(getWalletSlice);

  const getNetworkCardStatus = useCallback(
    (key: NETWORK_NAME) => {
      // if (!state.isAcceptTerm) return CARD_STATUS.UNSUPPORTED;

      switch (true) {
        case state.selectedNetwork === key:
          return CARD_STATUS.CHECKED;
        default:
          return CARD_STATUS.SUPPORTED;
      }
    },
    [state.selectedNetwork],
  );

  const networkOptionsRendered = useMemo(() => {
    return networkOrder.map((key) => {
      const network = NETWORKS[key];
      const status = getNetworkCardStatus(key as NETWORK_NAME);
      function handleClick() {
        switch (status) {
          case CARD_STATUS.CHECKED:
            break;
          // case CARD_STATUS.UNSUPPORTED:
          //   return;

          default:
            methods.onSelectNetwork(key);
            break;
        }
      }
      return (
        <Card
          key={`select_network_${key}`}
          status={status}
          onClick={handleClick}
          data={{
            title: network.name,
            logo: network.metadata.logo.base || '',
          }}
        />
      );
    });
  }, [getNetworkCardStatus, methods]);

  const getWalletCardStatus = useCallback(
    (key: WALLET_NAME, data: Wallet) => {
      // if (!state.isAcceptTerm) return CARD_STATUS.UNSUPPORTED;
      switch (true) {
        case state.selectedWallet === key:
          return CARD_STATUS.CHECKED;
        case !data.metadata.supportedNetwork.includes(state.selectedNetwork):
          return CARD_STATUS.UNSUPPORTED;
        case data.metadata.supportedNetwork.includes(state.selectedNetwork) &&
          state.selectedWallet === key:
          return CARD_STATUS.UNCHECKED;
        default:
          return CARD_STATUS.SUPPORTED;
      }
    },
    [state.selectedWallet, state.selectedNetwork],
  );

  const walletOptionsRendered = useMemo(() => {
    return walletOrder.map((key) => {
      const wallet = WALLETS[key];
      if (!wallet) return;

      const status = getWalletCardStatus(key as WALLET_NAME, wallet);
      function handleClick() {
        switch (status) {
          case CARD_STATUS.CHECKED:
          case CARD_STATUS.UNSUPPORTED:
            return;
          default:
            methods.onSelectWallet(key);
            break;
        }
      }
      return (
        <Card
          key={`select_wallet_${key}`}
          status={status}
          onClick={handleClick}
          data={{
            title: wallet.metadata.displayName,
            logo: wallet.metadata.logo,
          }}
        />
      );
    });
  }, [
    getWalletCardStatus,
    methods.onSelectWallet,
    state.selectedNetwork,
    state.isAcceptTerm,
  ]);

  const connectBtnProps = useMemo<ButtonProps>(() => {
    const { isAcceptTerm, selectedNetwork } = state;
    const isDisable = !userDevice;
    const isCurActiveNw = isConnected && selectedNetwork === networkName.src;

    let content = 'Connect Wallet';
    if (!isDisable) {
      if (isCurActiveNw) {
        content =
          selectedNetwork === NETWORK_NAME.ETHEREUM
            ? 'Metamask Connected'
            : 'Auro Connected';
      } else {
        content =
          selectedNetwork === NETWORK_NAME.ETHEREUM
            ? 'Connect Metamask'
            : 'Connect Auro';
      }
    }

    const wallet =
      selectedNetwork === NETWORK_NAME.ETHEREUM
        ? WALLET_NAME.METAMASK
        : WALLET_NAME.AURO;

    return {
      w: 'full',
      disabled: isDisable || isCurActiveNw,
      variant:
        isDisable || isCurActiveNw
          ? isConnected
            ? 'connected'
            : 'ghost'
          : 'primary.orange.solid',
      children: content,
      onClick: () =>
        (!isConnected || !isCurActiveNw) && methods.onSelectWallet(wallet),
    };
  }, [
    state.isAcceptTerm,
    state.selectedNetwork,
    userDevice,
    networkName.src,
    isConnected,
  ]);

  return {
    state,
    methods,
    networkOptionsRendered,
    walletOptionsRendered,
    connectBtnProps,
  };
}
