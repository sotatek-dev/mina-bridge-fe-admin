'use client';
import React, { useCallback, useMemo, useState } from 'react';

import { HistoryResponse, MetaDataHistory } from '@/services/usersService';

export type AssetsState = {
  pagingData: MetaDataHistory;
  data: any[];
  loading: boolean;
};

export type AssetsCtxValueType = {
  state: AssetsState;
  methods: {
    updateMetaData: (newMetaData: MetaDataHistory) => void;
    updateData: (newData: HistoryResponse[]) => void;
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

  const value = useMemo<AssetsCtxValueType>(
    () => ({
      state,
      methods: { updateMetaData, updateData },
    }),
    [state, updateMetaData, updateData]
  );

  return (
    <AssetsContext.Provider value={value}>{children}</AssetsContext.Provider>
  );
}
