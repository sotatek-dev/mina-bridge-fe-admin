'use client';
import React, { useCallback, useMemo, useState } from 'react';

import { TokenResponse, MetaDataHistory } from '@/services/adminService';

export type AssetsState = {
  pagingData: MetaDataHistory;
  data: any[];
  loading: boolean;
  search: string;
  currentPage: number;
};

export type AssetsCtxValueType = {
  state: AssetsState;
  methods: {
    updateMetaData: (newMetaData: MetaDataHistory) => void;
    updateData: (newData: TokenResponse[]) => void;
    updateSearch: (value: string) => void;
    updateCurrentPage: (page: number) => void;
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
  search: '',
  currentPage: 1,
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
    (newData: TokenResponse[]) =>
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

  const updateSearch = useCallback(
    (searchValue: string) =>
      setState((prev) =>
        prev.search !== searchValue
          ? {
              ...prev,
              search: searchValue,
            }
          : prev
      ),
    [setState]
  );

  const updateCurrentPage = useCallback(
    (page: number) =>
      setState((prev) =>
        prev.currentPage !== page
          ? {
              ...prev,
              currentPage: page,
            }
          : prev
      ),
    [setState]
  );

  const value = useMemo<AssetsCtxValueType>(
    () => ({
      state,
      methods: { updateMetaData, updateData, updateSearch, updateCurrentPage },
    }),
    [state, updateMetaData, updateData]
  );

  return (
    <AssetsContext.Provider value={value}>{children}</AssetsContext.Provider>
  );
}
