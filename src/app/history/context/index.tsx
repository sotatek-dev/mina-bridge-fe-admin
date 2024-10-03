'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { handleRequest } from '@/helpers/asyncHandlers';
import adminService from '@/services/adminService';
import { HistoryResponse, MetaDataHistory } from '@/services/usersService';
import { getWalletSlice, useAppSelector } from '@/store';

export type HistoryState = {
  pagingData: MetaDataHistory;
  data: HistoryResponse[];
  tip: string;
};

export type HistoryCtxValueType = {
  state: HistoryState;
  methods: {
    updateMetaData: (newMetaData: MetaDataHistory) => void;
    updateData: (newData: HistoryResponse[]) => void;
    updateTip: (tip: string) => void;
  };
};
export type HistoryProviderProps = React.PropsWithChildren<{}>;

export const initPagingDataState: HistoryState = {
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
};

export const HistoryContext = React.createContext<HistoryCtxValueType | null>(
  null
);

export function useHistoryState() {
  return React.useContext(HistoryContext) as HistoryCtxValueType;
}

export default function HistoryProvider({ children }: HistoryProviderProps) {
  const [state, setState] = useState<HistoryState>(initPagingDataState);
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

  const value = useMemo<HistoryCtxValueType>(
    () => ({
      state,
      methods: { updateMetaData, updateData, updateTip },
    }),
    [state, updateMetaData, updateData, updateTip]
  );

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
}
