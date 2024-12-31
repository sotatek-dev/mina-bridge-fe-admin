'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { handleRequest } from '@/helpers/asyncHandlers';
import adminService from '@/services/adminService';
import { HistoryResponse, MetaDataHistory } from '@/services/usersService';
import { getWalletSlice, useAppSelector } from '@/store';

export type AssetsState = {
  pagingData: MetaDataHistory;
  data: HistoryResponse[];
  tip: string;
  loading: boolean;
};

export type AssetsCtxValueType = {
  state: AssetsState;
  methods: {
    updateMetaData: (newMetaData: MetaDataHistory) => void;
    updateData: (newData: HistoryResponse[]) => void;
    updateTip: (tip: string) => void;
  };
};
export type AssetsProviderProps = React.PropsWithChildren<{}>;

export const initPagingDataState: AssetsState = {
  pagingData: {
    hasNextPage: false,
    hasPreviousPage: false,
    total: 0,
    totalOfPages: 1,
    currentPage: 1,
    perPage: 0,
  },
  data: [],
  tip: '0',
  loading: false,
};

export const AssetsContext = React.createContext<AssetsCtxValueType | null>(
  null
);

export function useAssetsState() {
  return React.useContext(AssetsContext) as AssetsCtxValueType;
}

export default function AssetsProvider({ children }: AssetsProviderProps) {
  const [state, setState] = useState<AssetsState>(initPagingDataState);
  const { isConnected } = useAppSelector(getWalletSlice);

  const updateMetaData = useCallback(
    (newMetaData: MetaDataHistory) =>
      setState((prev) =>
        prev.pagingData !== newMetaData
          ? {
              ...prev,
              pagingData: newMetaData,
            }
          : prev
      ),
    [setState]
  );

  const updateData = useCallback(
    (newData: HistoryResponse[]) =>
      setState((prev) =>
        prev.data !== newData
          ? {
              ...prev,
              data: newData,
            }
          : prev
      ),
    [setState]
  );

  const updateTip = useCallback(
    (tip: string) =>
      setState((prev) =>
        prev.tip !== tip
          ? {
              ...prev,
              tip,
            }
          : prev
      ),
    [setState]
  );

  const getCommonConfig = useCallback(async () => {
    if (!isConnected) return null;
    const [res, error] = await handleRequest(adminService.getCommonConfig());
    if (error) {
      // console.log('🚀 ~ getCommonConfig ~ error:', error);
      return false;
    }
    updateTip(res!!.tip);
    return true;
  }, [isConnected]);

  useEffect(() => {
    getCommonConfig();
  }, []);

  const value = useMemo<AssetsCtxValueType>(
    () => ({
      state,
      methods: { updateMetaData, updateData, updateTip },
    }),
    [state, updateMetaData, updateData, updateTip]
  );

  return (
    <AssetsContext.Provider value={value}>{children}</AssetsContext.Provider>
  );
}
