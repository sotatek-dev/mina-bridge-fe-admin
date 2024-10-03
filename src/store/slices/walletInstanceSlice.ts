import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { NETWORK_KEY } from './walletSlice';

import NETWORKS, { Network, NETWORK_NAME } from '@/models/network';
import WALLETS, { Wallet, WALLET_NAME } from '@/models/wallet';

// state type
export type WalletState = {
  walletInstance: Wallet | null;
  networkInstance: Record<NETWORK_KEY, Network | null>;
};

export type initInstancePayload = {
  walletKey: WALLET_NAME;
  networkName: Record<NETWORK_KEY, NETWORK_NAME>;
};

// init state
const initialState: WalletState = {
  walletInstance: null,
  networkInstance: {
    src: null,
    tar: null,
  },
};

// slice create
export const WalletInstanceSlice = createSlice({
  name: 'walletInstance',
  initialState,
  reducers: {
    changeNetwork(
      state,
      action: PayloadAction<{ key: NETWORK_KEY; value: NETWORK_NAME }>
    ) {
      state.networkInstance[action.payload.key] =
        NETWORKS[action.payload.value];
    },
    initializeInstance(state, action: PayloadAction<initInstancePayload>) {
      state.walletInstance = WALLETS[action.payload.walletKey] || initialState.walletInstance;
      state.networkInstance = {
        src: NETWORKS[action.payload.networkName.src],
        tar: NETWORKS[action.payload.networkName.tar],
      };
    },
    removeInstances(state) {
      state.walletInstance = null;
      state.networkInstance = {
        src: null,
        tar: null,
      };
    },
  },
});

// normal flow action
export const walletInstanceSliceActions = { ...WalletInstanceSlice.actions };

// export
export default WalletInstanceSlice.reducer;
