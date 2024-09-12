import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import DeviceDetector, { DeviceDetectorResult } from 'device-detector-js';

import { createAppThunk } from '..';

import TOKEN_ICONS, { TokenIconType } from '@/configs/tokenIcons';
import { handleRequest } from '@/helpers/asyncHandlers';
import { NETWORK_NAME } from '@/models/network/network';
import usersService, { SupportedPairResponse } from '@/services/usersService';

export type TokenType = {
  pairId: string;
  des: 'src' | 'tar';
  network: NETWORK_NAME;
  bridgeCtrAddr: string;
  tokenAddr: string;
  name: string;
  symbol: string;
  decimals: number;
};

export type LastAssetRecord = {
  asset: TokenType;
  range: string[];
  timestamp: number;
};

export type PairType = Pick<
  SupportedPairResponse,
  'id' | 'status' | 'createdAt' | 'updatedAt'
>;

export type SetLastNWFeePayload = {
  nw: NETWORK_NAME;
  data: { value: string; timestamp: number };
};

// state type
export type PersistState = {
  listPair: PairType[];
  listAsset: Record<NETWORK_NAME, TokenType[]>;
  listIcon: TokenIconType[];
  lastNetworkName?: NETWORK_NAME;
  lastAsset?: LastAssetRecord[];
  lastNetworkFee?: Record<NETWORK_NAME, { value: string; timestamp: number }>;
  userDevice?: DeviceDetectorResult;
};

// payload type

// init state
const initialState: PersistState = {
  listPair: [],
  listAsset: {
    [NETWORK_NAME.ETHEREUM]: [],
    [NETWORK_NAME.MINA]: [],
  },
  listIcon: TOKEN_ICONS,
  lastNetworkName: NETWORK_NAME.MINA,
  lastNetworkFee: {
    [NETWORK_NAME.ETHEREUM]: { value: '', timestamp: 0 },
    [NETWORK_NAME.MINA]: { value: '', timestamp: 0 },
  },
};

// thunks
const initializeData = createAppThunk()(
  'wallet/initializePairData',
  async (_, { dispatch, getState }) => {
    const curLastNetwork = getState().persist.lastNetworkName;
    const curSrcNetwork = getState().wallet.networkName.src;

    if (!curLastNetwork && !curSrcNetwork)
      dispatch(persistSlicePrvActions.setLastNetworkName(NETWORK_NAME.MINA));
    if (!curLastNetwork && curSrcNetwork)
      dispatch(persistSlicePrvActions.setLastNetworkName(curSrcNetwork));

    dispatch(persistSlicePrvActions.setListIcons(TOKEN_ICONS));
    // dispatch(walletInstanceSliceActions.removeInstances());
    const [res, error] = await handleRequest(
      usersService.getListSupportedPairs()
    );
    if (error) {
      dispatch(persistSlicePrvActions.setListPair([]));
      dispatch(
        persistSlicePrvActions.setListAsset({
          [NETWORK_NAME.ETHEREUM]: [],
          [NETWORK_NAME.MINA]: [],
        })
      );
      return false;
    }
    let listPair: PersistState['listPair'] = [];
    let listAssets: PersistState['listAsset'] = {
      [NETWORK_NAME.ETHEREUM]: [],
      [NETWORK_NAME.MINA]: [],
    };

    function addAsset(network: string, value: Omit<TokenType, 'network'>) {
      let nw = NETWORK_NAME.ETHEREUM;
      switch (network) {
        case 'eth':
          nw = NETWORK_NAME.ETHEREUM;
          listAssets[nw].push({
            ...value,
            network: nw,
          });
          break;
        case NETWORK_NAME.MINA:
          nw = NETWORK_NAME.MINA;
          listAssets[nw].push({
            ...value,
            network: nw,
          });
          break;
        default:
          break;
      }
    }

    res!!.forEach((pair) => {
      listPair.push({
        id: pair.id,
        status: pair.status,
        createdAt: pair.createdAt,
        updatedAt: pair.updatedAt,
      });

      addAsset(pair.fromChain, {
        pairId: `${pair.id}`,
        bridgeCtrAddr: pair.fromScAddress,
        tokenAddr: pair.fromAddress,
        des: 'src',
        symbol: pair.fromSymbol.toUpperCase(),
        name: '',
        decimals: pair.fromDecimal,
      });
      addAsset(pair.toChain, {
        pairId: `${pair.id}`,
        bridgeCtrAddr: pair.toScAddress,
        tokenAddr: pair.toAddress,
        des: 'tar',
        symbol: pair.toSymbol.toUpperCase(),
        name: '',
        decimals: pair.toDecimal,
      });
    });

    dispatch(persistSlicePrvActions.setListPair(listPair));
    dispatch(persistSlicePrvActions.setListAsset(listAssets));
    return true;
  }
);

const deviceCheck = createAppThunk()(
  'wallet/deviceCheck',
  async (_, { dispatch, getState }) => {
    const { userDevice } = getState().persist;
    if (!userDevice) {
      const dd = new DeviceDetector();
      const device = dd.parse(window.navigator.userAgent);
      dispatch(persistSlicePrvActions.setUserDevice(device));
      return device;
    }
    return userDevice;
  }
);

// slice create
export const persistSlice = createSlice({
  name: 'persist',
  initialState,
  reducers: {
    setUserDevice(state, action: PayloadAction<DeviceDetectorResult>) {
      state.userDevice = action.payload;
    },
    setListIcons(state, action: PayloadAction<TokenIconType[]>) {
      state.listIcon = action.payload;
    },
    setListPair(state, action: PayloadAction<PersistState['listPair']>) {
      state.listPair = action.payload;
    },
    setListAsset(state, action: PayloadAction<PersistState['listAsset']>) {
      state.listAsset = action.payload;
    },
    setLastNetworkName(state, action: PayloadAction<NETWORK_NAME>) {
      state.lastNetworkName = action.payload;
    },
    setLastAsset(state, action: PayloadAction<LastAssetRecord>) {
      // if don't have any record
      if (!state.lastAsset) {
        state.lastAsset = [action.payload];
      } else {
        // if already have
        const existedIndex = state.lastAsset.findIndex(
          (e) =>
            e.asset.pairId === action.payload.asset.pairId &&
            e.asset.symbol === action.payload.asset.symbol &&
            e.asset.network === action.payload.asset.network
        );
        // if not existed in the list
        if (existedIndex < 0) {
          state.lastAsset.push(action.payload);
        } else {
          // if existed in the list, replace with new value
          state.lastAsset[existedIndex] = action.payload;
        }
      }
    },
    setLastNwFee(state, action: PayloadAction<SetLastNWFeePayload>) {
      if (!state.lastNetworkFee) {
        let newValue: any = JSON.parse(
          JSON.stringify(initialState.lastNetworkFee)
        );
        Object.values(NETWORK_NAME).forEach((key) => {
          if (key === action.payload.nw) {
            newValue[key] = action.payload.data;
          } else {
            newValue[key] = { timestamp: 0, value: '' };
          }
        });
        state.lastNetworkFee = newValue;
      } else {
        state.lastNetworkFee[action.payload.nw] = action.payload.data;
      }
    },
  },
});

// normal flow action
const persistSlicePrvActions = persistSlice.actions;

export const persistSliceActions = {
  initializeData,
  deviceCheck,
  setLastNetworkName: persistSlicePrvActions.setLastNetworkName,
  setLastAsset: persistSlicePrvActions.setLastAsset,
  setLastNwFee: persistSlicePrvActions.setLastNwFee,
};

// export
export default persistSlice.reducer;
