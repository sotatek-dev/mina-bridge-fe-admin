import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookie from 'cookiejs';

import { createAppThunk } from '..';

import { persistSliceActions, TokenType } from './persistSlice';
import { walletInstanceSliceActions } from './walletInstanceSlice';

import { handleRequest } from '@/helpers/asyncHandlers';
import StorageUtils from '@/helpers/handleBrowserStorage';
import NETWORKS, { Network, NETWORK_NAME } from '@/models/network';
import WALLETS, { Wallet, WALLET_NAME } from '@/models/wallet';
import authService, { ResponseAuthToken } from '@/services/authService';

export enum NETWORK_KEY {
  SRC = 'src',
  TAR = 'tar',
}

// state type
export type WalletStateConnected = {
  isConnected: true;
  address: string;
  walletKey: WALLET_NAME;
  networkName: Record<NETWORK_KEY, NETWORK_NAME>;
  asset?: TokenType;
};
export type WalletStateDisConnected = {
  address?: undefined;
  isConnected: false;
  walletKey: null;
  networkName: Record<NETWORK_KEY, null>;
  asset?: TokenType;
};
export type WalletState = WalletStateConnected | WalletStateDisConnected;

// payload type
export type connectWalletPayload = {
  wallet: Wallet;
  network: Network;
  isSign?: boolean;
  onCnStart?: () => void;
  onCnFinish?: () => void;
  whileCnHandle?: () => void;
};

export type connectedPayload = Required<
  Omit<WalletStateConnected, 'isConnected' | 'asset'>
>;

// init state
const initialState: WalletState = {
  isConnected: false,
  walletKey: null,
  networkName: {
    src: null,
    tar: null,
  },
};

// thunk action
const connectWallet = createAppThunk<{
  message: string;
}>()(
  'wallet/connectWallet',
  async (
    {
      wallet,
      network,
      isSign,
      onCnStart,
      onCnFinish,
      whileCnHandle,
    }: connectWalletPayload,
    { dispatch, getState }
  ) => {
    let msg = '';
    if (isSign) {
      const [res, error] = await handleRequest(authService.getMessage());
      if (error || !res) return;
      msg = res.message;
    }

    // Connect and sign signature
    const { account, signature } = await wallet.connect(
      network,
      msg,
      isSign,
      onCnStart,
      onCnFinish,
      undefined,
      whileCnHandle
    );

    let token: ResponseAuthToken | null = {
      accessToken: '',
      refreshToken: '',
    };

    // Check if Reconnection don't sign

    // Login with auth api
    // TODO
    if (isSign) {
      switch (wallet.name) {
        case WALLET_NAME.METAMASK:
          if (network.name === NETWORK_NAME.ETHEREUM) {
            const [resEVM, errorEMV] = await handleRequest(
              authService.loginAdminEVM({ address: account, signature })
            );
            if (errorEMV) break;
            token = resEVM;
          }
          if (network.name === NETWORK_NAME.MINA) {
            const [resMina, errorMina] = await handleRequest(
              authService.loginAdminMina({ address: account, signature })
            );
            if (errorMina) break;
            token = resMina;
          }
          break;
        case WALLET_NAME.AURO:
          if (!isSign) break;
          const [resMina, errorMina] = await handleRequest(
            authService.loginAdminMina({ address: account, signature })
          );
          if (errorMina) break;
          token = resMina;
          break;
        default:
          break;
      }
    }

    if (token === null || !token.accessToken || !token.refreshToken)
      throw new Error('Signature invalid');

    StorageUtils.setToken(token.accessToken);
    // const curTarNetwork = getState().wallet.networkName.tar;
    // const isCurTarMatchSrc = curTarNetwork === network.name;
    const availTarNetwork = (Object.keys(NETWORKS) as NETWORK_NAME[]).filter(
      (key) => key !== network.name
    )[0];

    // store wallet and network key which contain serialize data that could use persist
    dispatch(
      walletSlicePrvActions.connected({
        walletKey: wallet.name,
        networkName: {
          src: network.name,
          // tar: isCurTarMatchSrc ? availTarNetwork : curTarNetwork,
          tar: availTarNetwork,
        },
        address: account,
      })
    );
    const expirationDate = new Date();
    expirationDate.setDate(
      expirationDate.getDate() + Number(process.env.NEXT_PUBLIC_EXPIRE_COOKIE)
    );
    Cookie.set('address', account, {
      expires: expirationDate,
    });

    // store wallet and network instance which contain non-serialize data that couldn't use persist
    dispatch(
      walletInstanceSliceActions.initializeInstance({
        walletKey: wallet.name,
        networkName: {
          src: network.name,
          // tar: isCurTarMatchSrc ? availTarNetwork : curTarNetwork,
          tar: availTarNetwork,
        },
      })
    );

    // store last network key
    dispatch(persistSliceActions.setLastNetworkName(network.name));
    return true;
  }
);

// sync instance data with persisted wallet and network key when reload, revisit site
const rehydrateNetworkInstance = createAppThunk()(
  'wallet/rehydrateNetworkInstance',
  async (_, { dispatch, getState }) => {
    const { networkName, isConnected } = getState().wallet;
    if (!isConnected) return true;
    dispatch(
      walletInstanceSliceActions.changeNetwork({
        key: NETWORK_KEY.SRC,
        value: networkName.src,
      })
    );
    dispatch(
      walletInstanceSliceActions.changeNetwork({
        key: NETWORK_KEY.TAR,
        value: networkName.tar,
      })
    );

    return true;
  }
);
type ChangeNetworkPayload = { key: NETWORK_KEY; network: Network };

// when update network, also store network key to related states
const changeNetwork = createAppThunk()(
  'wallet/thunk/changeNetwork',
  async ({ key, network }: ChangeNetworkPayload, { dispatch, getState }) => {
    const curTarNetwork = getState().wallet.networkName.tar;
    const curSrcNetwork = getState().wallet.networkName.src;

    switch (key) {
      case NETWORK_KEY.SRC:
        const isCurTarMatchSrc = curTarNetwork === network.name;
        const availTarNetwork = (
          Object.keys(NETWORKS) as NETWORK_NAME[]
        ).filter((key) => key !== network.name)[0];
        // change src network
        const srcNWPayload = { key, value: network.name };
        dispatch(walletSlicePrvActions.changeNetwork(srcNWPayload));
        dispatch(walletInstanceSliceActions.changeNetwork(srcNWPayload));
        dispatch(persistSliceActions.setLastNetworkName(network.name)); // store key to persist slice
        // change tar network if src and tar is the same
        if (isCurTarMatchSrc) {
          const tarNWPayload = {
            key: NETWORK_KEY.TAR,
            value: availTarNetwork,
          };
          dispatch(walletSlicePrvActions.changeNetwork(tarNWPayload));
          dispatch(walletInstanceSliceActions.changeNetwork(tarNWPayload));
        }
        break;
      case NETWORK_KEY.TAR:
        const isCurSrcMatchTar = curSrcNetwork === network.name;
        // throw error if src network is equal tar network
        if (isCurSrcMatchTar)
          throw new Error("Source network couldn't be Target network");
        // change tar network
        const payload = { key, value: network.name };

        dispatch(walletSlicePrvActions.changeNetwork(payload));
        dispatch(walletInstanceSliceActions.changeNetwork(payload));
        break;
      default:
        break;
    }

    return true;
  }
);

const disconnect = createAppThunk()(
  'wallet/disconnect',
  async (_, { dispatch }) => {
    dispatch(walletSlicePrvActions.disconnectWallet());
    dispatch(walletInstanceSliceActions.removeInstances());
    StorageUtils.setToken('');
    Cookie.remove('address');
    return true;
  }
);

const reconnectWallet = createAppThunk()(
  'wallet/reconnectWallet',
  async (_, { dispatch, getState }) => {
    const { walletKey, networkName } = getState().wallet;
    if (!walletKey)
      throw new Error(
        "You haven't connected to any wallet or network just yet"
      );
    dispatch(
      walletInstanceSliceActions.initializeInstance({
        walletKey,
        networkName,
      })
    );
    const res = await dispatch(
      connectWallet({
        wallet: WALLETS[walletKey]!!,
        network: NETWORKS[networkName.src],
      })
    );
    if (
      connectWallet.rejected.match(res) &&
      res.error.message ===
        WALLETS[walletKey]!!.errorList.WALLET_CONNECT_REJECTED
    ) {
      dispatch(disconnect());
      return false;
    }

    await WALLETS[walletKey]!!.switchNetwork(NETWORKS[networkName.src]);

    return true;
  }
);

// slice create
export const WalletSlice = createSlice({
  name: 'wallet',
  initialState: initialState as WalletState,
  reducers: {
    updateAccount(state, action: PayloadAction<string>) {
      state.address = action.payload;
    },
    changeNetwork(
      state,
      action: PayloadAction<{ key: 'src' | 'tar'; value: NETWORK_NAME }>
    ) {
      state.networkName[action.payload.key] = action.payload.value;
    },
    connected(state, action: PayloadAction<connectedPayload>) {
      state.isConnected = true;
      state.walletKey = action.payload.walletKey;
      state.networkName = action.payload.networkName;
      state.address = action.payload.address;
    },
    disconnectWallet(state) {
      state.address = undefined;
      state.isConnected = false;
      state.walletKey = null;
      state.networkName = { src: null, tar: null };
    },
    changeAsset(state, action: PayloadAction<TokenType | undefined>) {
      state.asset = action.payload;
    },
  },
});

// normal flow action
const walletSlicePrvActions = WalletSlice.actions;
export const walletSliceActions = {
  changeAsset: walletSlicePrvActions.changeAsset,
  updateAccount: walletSlicePrvActions.updateAccount,
  connectWallet,
  rehydrateNetworkInstance,
  changeNetwork,
  disconnect,
  reconnectWallet,
};

// export
export default WalletSlice.reducer;
