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
  isLoadingTokenName: boolean;
  isInitLoading: boolean;
  addressError?: string;
};

export type DeployCtxValueType = {
  state: DeployState;
  methods: {
    setIsLoading: (loading: boolean) => void;
    setIsLoadingTokenName: (loading: boolean) => void;
    setIsInitLoading: (loading: boolean) => void;
    setAddressError: (addressError?: string) => void;
    setValue: (value: DeployValue) => void;
    setFetchedValue: (fetchedValue: DeployValue) => void;
  };
};
export type DeployProviderProps = React.PropsWithChildren<{}>;

export const initPagingDataState: DeployState = {
  isLoading: false,
  isLoadingTokenName: false,
  isInitLoading: false,
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

  const setIsLoadingTokenName = useCallback(
    (loading: boolean) =>
      setState((prev) =>
        prev.isLoadingTokenName !== loading
          ? {
              ...prev,
              isLoadingTokenName: loading,
            }
          : prev
      ),
    [setState]
  );

  const setIsInitLoading = useCallback(
    (loading: boolean) =>
      setState((prev) =>
        prev.isInitLoading !== loading
          ? {
              ...prev,
              isInitLoading: loading,
            }
          : prev
      ),
    [setState]
  );

  const setAddressError = useCallback(
    (addressError?: string) =>
      setState((prev) =>
        prev.addressError !== addressError
          ? {
              ...prev,
              addressError,
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
        setIsInitLoading,
        setAddressError,
        setIsLoadingTokenName,
      },
    }),
    [
      state,
      setValue,
      setIsLoading,
      setIsInitLoading,
      setFetchedValue,
      setIsLoadingTokenName,
    ]
  );

  return (
    <DeployContext.Provider value={value}>{children}</DeployContext.Provider>
  );
}
