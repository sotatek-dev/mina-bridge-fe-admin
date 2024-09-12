import { useCallback, useMemo } from 'react';

import { useModalCWState } from '../context';
import Card, { CARD_STATUS } from '../partials/card';

import NETWORKS, { NETWORK_NAME } from '@/models/network';
import WALLETS, { WALLET_NAME, Wallet } from '@/models/wallet';
import { getPersistSlice, useAppSelector } from '@/store';

const networkOrder = [NETWORK_NAME.MINA, NETWORK_NAME.ETHEREUM];
const walletOrder = [WALLET_NAME.METAMASK, WALLET_NAME.AURO];

export default function useModalCWLogic() {
  const { state, methods } = useModalCWState();
  const { userDevice } = useAppSelector(getPersistSlice);

  const getNetworkCardStatus = useCallback(
    (key: NETWORK_NAME) => {
      if (!state.isAcceptTerm) return CARD_STATUS.UNSUPPORTED;

      switch (true) {
        case state.selectedNetwork === key:
          return CARD_STATUS.CHECKED;
        default:
          return CARD_STATUS.SUPPORTED;
      }
    },
    [state.selectedNetwork, state.isAcceptTerm]
  );

  const networkOptionsRendered = useMemo(() => {
    return networkOrder.map((key) => {
      const network = NETWORKS[key];
      const status = getNetworkCardStatus(key as NETWORK_NAME);
      function handleClick() {
        switch (status) {
          case CARD_STATUS.CHECKED:
          case CARD_STATUS.UNSUPPORTED:
            return;

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
  }, [getNetworkCardStatus, methods.onSelectNetwork, state.isAcceptTerm]);

  const getWalletCardStatus = useCallback(
    (key: WALLET_NAME, data: Wallet) => {
      if (!state.isAcceptTerm || !userDevice) return CARD_STATUS.UNSUPPORTED;
      const nwInstance = NETWORKS[state.selectedNetwork];
      const isSelected = state.selectedWallet === key;
      const isSupported =
        data.metadata.supportedNetwork.includes(state.selectedNetwork) &&
        data.metadata.supportedDevices[nwInstance.type].includes(
          userDevice.device?.type || ''
        );

      switch (true) {
        case isSelected:
          return CARD_STATUS.CHECKED;
        case !isSupported:
          return CARD_STATUS.UNSUPPORTED;
        case isSupported && !isSelected:
          return CARD_STATUS.UNCHECKED;
        default:
          return CARD_STATUS.SUPPORTED;
      }
    },
    [
      state.selectedWallet,
      state.selectedNetwork,
      state.isAcceptTerm,
      userDevice,
    ]
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

  return { state, methods, networkOptionsRendered, walletOptionsRendered };
}
