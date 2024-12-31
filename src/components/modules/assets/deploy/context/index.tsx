'use client';
import { isEqual } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { handleRequest } from '@/helpers/asyncHandlers';
import { formWei } from '@/helpers/common';
import useETHBridgeContract from '@/hooks/useETHBridgeContract';
import { Network } from '@/models/network';
import { NETWORK_TYPE } from '@/models/network/network';
import {
  getPersistSlice,
  getWalletInstanceSlice,
  getWalletSlice,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { TokenType } from '@/store/slices/persistSlice';
import { uiSliceActions } from '@/store/slices/uiSlice';
import { walletSliceActions } from '@/store/slices/walletSlice';

export type ValueType = {
  min: string;
  max: string;
};
export type DisplayedDeployType = {
  dailyQuota: string;
  tip: string;
  feeUnlockMina: string;
  feeUnlockEth: string;
};

export type DeployState = {
  isLoading: boolean;
  isFetching: boolean;
  isMinMaxLoading: boolean;
  value: ValueType;
  displayedConfig: DisplayedDeployType;
  asset: TokenType | null;
  assetRange: string[];
};

export type DeployCtxValueType = {
  state: DeployState;
  methods: {
    setIsLoading: (loading: boolean) => void;
    setIsFetching: (loading: boolean) => void;
    updateAsset: (asset: TokenType) => void;
    setValue: (value: ValueType) => void;
    setDisplayedConfig: (displayedConfig: DisplayedDeployType) => void;
    updateAssetRage: (assetRange: string[]) => void;
  };
};
export type DeployProviderProps = React.PropsWithChildren<{}>;

export const initPagingDataState: DeployState = {
  isLoading: true,
  isFetching: true,
  isMinMaxLoading: true,
  value: {
    min: '',
    max: '',
  },
  displayedConfig: {
    dailyQuota: '',
    tip: '',
    feeUnlockMina: '',
    feeUnlockEth: '',
  },
  asset: null,
  assetRange: ['0', '0'],
};

export const DeployContext = React.createContext<DeployCtxValueType | null>(
  null
);

export function useDeployState() {
  return React.useContext(DeployContext) as DeployCtxValueType;
}

export default function DeployProvider({ children }: DeployProviderProps) {
  const dispatch = useAppDispatch();

  const { networkInstance } = useAppSelector(getWalletInstanceSlice);
  const { asset, address } = useAppSelector(getWalletSlice);
  const { listAsset } = useAppSelector(getPersistSlice);

  const initCount = useRef<number>(0);

  const [state, setState] = useState<DeployState>(initPagingDataState);

  const nwMetaData = networkInstance.src?.metadata;

  const bridgeCtr = useETHBridgeContract({
    network: networkInstance.src,
    provider:
      nwMetaData && 'provider' in nwMetaData ? nwMetaData.provider : undefined,
    ctr: asset ? { addr: asset.bridgeCtrAddr, network: asset.network } : null,
  });

  // update partial state
  const updateAsset = useCallback(
    (asset: TokenType) => {
      setState((prev) =>
        !isEqual(prev.asset, asset)
          ? {
              ...prev,
              asset,
            }
          : prev
      );
    },
    [setState]
  );

  const setValue = useCallback(
    (value: ValueType) => {
      setState((prev) =>
        prev.value !== value
          ? {
              ...prev,
              value,
            }
          : prev
      );
    },
    [setState]
  );

  const setDisplayedConfig = useCallback(
    (displayedConfig: DisplayedDeployType) => {
      setState((prev) =>
        prev.displayedConfig !== displayedConfig
          ? {
              ...prev,
              displayedConfig,
            }
          : prev
      );
    },
    [setState]
  );

  // init assets
  useEffect(() => {
    if (!networkInstance.src || listAsset[networkInstance.src.name].length < 1)
      return;
    const assets = listAsset[networkInstance.src.name].filter(
      (asset) => asset.des === 'src'
    );
    if (!asset || asset.network !== networkInstance.src.name) {
      dispatch(
        walletSliceActions.changeAsset(
          assets.length > 0 ? assets[0] : undefined
        )
      );
      return;
    }

    updateAsset(asset);
  }, [dispatch, asset, listAsset, networkInstance.src]);

  const setIsLoading = useCallback(
    (loading: boolean) =>
      setState((prev) =>
        prev.isLoading !== loading
          ? {
              ...prev,
              isLoading: loading,
            }
          : prev
      ),
    [setState]
  );

  const setIsFetching = useCallback(
    (fetching: boolean) =>
      setState((prev) =>
        prev.isFetching !== fetching
          ? {
              ...prev,
              isFetching: fetching,
            }
          : prev
      ),
    [setState]
  );

  const setIsMinMaxLoading = useCallback(
    (isMinMaxLoading: boolean) =>
      setState((prev) =>
        prev.isMinMaxLoading !== isMinMaxLoading
          ? {
              ...prev,
              isMinMaxLoading,
            }
          : prev
      ),
    [setState]
  );

  // update min max
  const updateAssetRage = useCallback(
    (assetRange: string[]) => {
      setState((prev) =>
        !isEqual(prev.assetRange, assetRange)
          ? {
              ...prev,
              assetRange,
            }
          : prev
      );
    },
    [setState]
  );

  // get asset min max

  async function handleInitCtr() {
    const { default: ERC20Contract } = await import(
      '@/models/contract/zk/contract.ERC20'
    );
    await ERC20Contract.init();
  }

  async function getAssetMaxMin(nw: Network, asset: TokenType) {
    switch (nw.type) {
      case NETWORK_TYPE.EVM:
        if (!bridgeCtr) return updateAssetRage(['0', '0']);
        const [min, minError] = await handleRequest(bridgeCtr.getMinAmount());
        const [max, maxError] = await handleRequest(bridgeCtr.getMaxAmount());

        setIsMinMaxLoading(false);
        if (minError || maxError) {
          return updateAssetRage(['0', '0']);
        }
        return updateAssetRage([
          formWei(min!!.toString(), asset.decimals),
          formWei(max!!.toString(), asset.decimals),
        ]);
      case NETWORK_TYPE.ZK:
        if (!asset?.bridgeCtrAddr || !asset?.tokenAddr)
          return updateAssetRage(['0', '0']);
        console.log('--------start init----------');
        if (initCount.current < 1) {
          dispatch(uiSliceActions.startLoading());
          await handleInitCtr();
          initCount.current += 1;
          console.log('--------finish init----------');
          dispatch(uiSliceActions.endLoading());
        }
        try {
          const { default: ERC20Contract } = await import(
            '@/models/contract/zk/contract.ERC20'
          );
          const ctr = await new ERC20Contract(
            asset?.bridgeCtrAddr,
            asset?.tokenAddr
          );
          console.log('🚀 ~ getMinaConfig ~ ctr:', ctr);
          await ctr.fetchInvolveAccount(address!!);
          console.log('🚀 ~ getAssetMaxMin ~ address:', address);
          const minAmount = await ctr.getMinAmount();
          console.log('🚀 ~ getMinaConfig ~ minAmount:', minAmount.toBigInt());
          const maxAmount = await ctr.getMaxAmount();
          console.log('🚀 ~ getMinaConfig ~ maxAmount:', maxAmount.toBigInt());

          setIsMinMaxLoading(false);
          return updateAssetRage([
            formWei(minAmount, asset.decimals),
            formWei(maxAmount, asset.decimals),
          ]);
        } catch (error) {
          // console.log('🚀 ~ getMinaConfig ~ error:', error);
          updateAssetRage(['0', '0']);
          return setIsMinMaxLoading(false);
        }
      default:
        break;
    }
  }

  // get asset max min when have network and change asset
  useEffect(() => {
    if (!networkInstance.src || !asset) return;
    getAssetMaxMin(networkInstance.src, asset);
  }, [bridgeCtr, networkInstance.src, asset]);

  const value = useMemo<DeployCtxValueType>(
    () => ({
      state,
      methods: {
        setIsLoading,
        setIsFetching,
        updateAsset,
        setValue,
        setDisplayedConfig,
        updateAssetRage,
      },
    }),
    [
      state,
      setIsLoading,
      setIsFetching,
      setValue,
      updateAsset,
      setDisplayedConfig,
      updateAssetRage,
    ]
  );

  return (
    <DeployContext.Provider value={value}>{children}</DeployContext.Provider>
  );
}
