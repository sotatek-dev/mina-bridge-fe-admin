'use client';
import { isEqual } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';

export type ViewValue = {
  id: number;
  evmAddress: string;
  minaAddress: string;
  assetName: string;
};

export type MinMaxValue = {
  minAmountToBridge: string;
  maxAmountToBridge: string;
};

export type ConfigValue = {
  dailyQuota: string;
  bridgeFee: string;
  unlockingFee: string;
  mintingFee: string;
};

export type DetailState = {
  viewValue: ViewValue;
  minMaxValue: MinMaxValue;
  fetchedMinMaxValue: MinMaxValue;
  configValue: ConfigValue;
  fetchedConfigValue: ConfigValue;
  isLoading: boolean;
  isInitLoading: boolean;
};

export type DetailCtxValueType = {
  state: DetailState;
  methods: {
    setIsInitLoading: (loading: boolean) => void;
    setIsLoading: (loading: boolean) => void;
    setInitValue: (value: DetailState) => void;
    setMinMaxValue: (value: MinMaxValue) => void;
    setFetchedMinMaxValue: (value: MinMaxValue) => void;
    setConfigValue: (value: ConfigValue) => void;
    setFetchedConfigValue: (value: ConfigValue) => void;
  };
};
export type DetailProviderProps = React.PropsWithChildren<{}>;

export const initPagingDataState: DetailState = {
  isLoading: false,
  isInitLoading: false,
  viewValue: {
    id: 0,
    evmAddress: '',
    minaAddress: '',
    assetName: '',
  },
  minMaxValue: {
    minAmountToBridge: '0',
    maxAmountToBridge: '0',
  },
  fetchedMinMaxValue: {
    minAmountToBridge: '0',
    maxAmountToBridge: '0',
  },
  configValue: {
    dailyQuota: '0',
    bridgeFee: '0',
    unlockingFee: '0',
    mintingFee: '0',
  },
  fetchedConfigValue: {
    dailyQuota: '0',
    bridgeFee: '0',
    unlockingFee: '0',
    mintingFee: '0',
  },
};

export const DetailContext = React.createContext<DetailCtxValueType | null>(
  null
);

export function useDetailState() {
  return React.useContext(DetailContext) as DetailCtxValueType;
}

export default function DetailProvider({ children }: DetailProviderProps) {
  const [state, setState] = useState<DetailState>(initPagingDataState);

  const setInitValue = useCallback(
    (value: DetailState) => {
      setState(value);
    },
    [setState]
  );

  const setMinMaxValue = useCallback(
    (minMaxValue: MinMaxValue) => {
      setState((prev) =>
        !isEqual(prev.minMaxValue, value)
          ? {
              ...prev,
              minMaxValue,
            }
          : prev
      );
    },
    [setState]
  );

  const setFetchedMinMaxValue = useCallback(
    (fetchedMinMaxValue: MinMaxValue) => {
      setState((prev) =>
        !isEqual(prev.fetchedMinMaxValue, value)
          ? {
              ...prev,
              fetchedMinMaxValue,
            }
          : prev
      );
    },
    [setState]
  );

  const setConfigValue = useCallback(
    (configValue: ConfigValue) => {
      console.log({
        value,
        default: state.configValue,
        equal: !isEqual(state.configValue, value),
      });
      setState((prev) =>
        !isEqual(prev.configValue, value)
          ? {
              ...prev,
              configValue,
            }
          : prev
      );
    },
    [setState]
  );

  const setFetchedConfigValue = useCallback(
    (fetchedConfigValue: ConfigValue) => {
      setState((prev) =>
        !isEqual(prev.fetchedConfigValue, value)
          ? {
              ...prev,
              fetchedConfigValue,
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

  const value = useMemo<DetailCtxValueType>(
    () => ({
      state,
      methods: {
        setInitValue,
        setIsInitLoading,
        setMinMaxValue,
        setFetchedMinMaxValue,
        setConfigValue,
        setFetchedConfigValue,
        setIsLoading,
      },
    }),
    [
      state,
      setIsLoading,
      setIsInitLoading,
      setInitValue,
      setMinMaxValue,
      setFetchedMinMaxValue,
      setConfigValue,
      setFetchedConfigValue,
    ]
  );

  return (
    <DetailContext.Provider value={value}>{children}</DetailContext.Provider>
  );
}
