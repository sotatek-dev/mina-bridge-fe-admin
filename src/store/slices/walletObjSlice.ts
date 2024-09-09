import MinaProvider from '@aurowallet/mina-provider';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// state type
export type WalletObjState = {
  metamask: {
    isInjected: boolean;
    ethereum?: MetaMaskInpageProvider;
  };
  auro: {
    isInjected: boolean;
    mina?: MinaProvider;
  };
};

// payload type
export type InjectMetamaskPayload = {
  ethereum: MetaMaskInpageProvider;
};
export type InjectMinaPayload = { mina: MinaProvider };
export type createMetamaskProviderPayload = {
  ethereum: MetaMaskInpageProvider;
};

// init state
const initialState: WalletObjState = {
  metamask: {
    isInjected: false,
  },
  auro: {
    isInjected: false,
  },
};

// slice create
export const walletObjSlice = createSlice({
  name: 'walletObj',
  initialState,
  reducers: {
    injectMetamask: (state, action: PayloadAction<InjectMetamaskPayload>) => {
      if (state.metamask.isInjected) return state;
      state.metamask.isInjected = true;
      state.metamask.ethereum = action.payload.ethereum;
    },
    injectMina: (state, action: PayloadAction<InjectMinaPayload>) => {
      if (state.auro.isInjected) return state;
      state.auro.isInjected = true;
      state.auro.mina = action.payload.mina;
    },
  },
});

// normal flow action
export const walletObjSliceActions = {
  ...walletObjSlice.actions,
};

// export
export default walletObjSlice.reducer;
