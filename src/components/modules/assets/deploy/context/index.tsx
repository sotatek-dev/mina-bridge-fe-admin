'use client';
import { isEqual } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';

export type DeployValue = {
  assetAddress: string;
  assetName: string;
  minAmountToBridge: string;
  maxAmountToBridge: string;
  dailyQuota: string;
  bridgeFee: string;
  unlockingFee: string;
  mintingFee: string;
};

export type DeployState = {
  value: DeployValue;
  fetchedValue: DeployValue;
  isLoading: boolean;
};

export type DeployCtxValueType = {
  state: DeployState;
  methods: {
    setIsLoading: (loading: boolean) => void;
    setValue: (value: DeployValue) => void;
    setFetchedValue: (fetchedValue: DeployValue) => void;
  };
};
export type DeployProviderProps = React.PropsWithChildren<{}>;

export const initPagingDataState: DeployState = {
  isLoading: false,
  value: {
    assetAddress: '',
    assetName: '',
    minAmountToBridge: '0',
    maxAmountToBridge: '0',
    dailyQuota: '0',
    bridgeFee: '0',
    unlockingFee: '0',
    mintingFee: '0',
  },
  fetchedValue: {
    assetAddress: '',
    assetName: '',
    minAmountToBridge: '',
    maxAmountToBridge: '',
    dailyQuota: '',
    bridgeFee: '',
    unlockingFee: '',
    mintingFee: '',
  },
};

export const DeployContext = React.createContext<DeployCtxValueType | null>(
  null
);

export function useDeployState() {
  return React.useContext(DeployContext) as DeployCtxValueType;
}

export default function DeployProvider({ children }: DeployProviderProps) {
  const [state, setState] = useState<DeployState>(initPagingDataState);

  const setValue = useCallback(
    (value: DeployValue) => {
      setState((prev) =>
        !isEqual(prev.value, value)
          ? {
              ...prev,
              value,
            }
          : prev
      );
    },
    [setState]
  );

  const setFetchedValue = useCallback(
    (fetchedValue: DeployValue) => {
      setState((prev) =>
        !isEqual(prev.fetchedValue, fetchedValue)
          ? {
              ...prev,
              fetchedValue,
            }
          : prev
      );
    },
    [setState]
  );

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

  const value = useMemo<DeployCtxValueType>(
    () => ({
      state,
      methods: {
        setValue,
        setFetchedValue,
        setIsLoading,
      },
    }),
    [state, setValue, setIsLoading, setFetchedValue]
  );

  return (
    <DeployContext.Provider value={value}>{children}</DeployContext.Provider>
  );
}
