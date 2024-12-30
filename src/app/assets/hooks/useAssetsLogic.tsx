'use client';
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';

import { initPagingDataState, useAssetsState } from '../context';

import ROUTES from '@/configs/routes';
import { handleException, handleRequest } from '@/helpers/asyncHandlers';
import useNotifier from '@/hooks/useNotifier';
import adminService from '@/services/adminService';
import { getWalletSlice, useAppDispatch, useAppSelector } from '@/store';
import { walletSliceActions } from '@/store/slices/walletSlice';

export default function useHistoryLogic() {
  const { methods, state } = useAssetsState();
  const { isConnected, address } = useAppSelector(getWalletSlice);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { sendNotification } = useNotifier();
  const [searchValue, setSearchValue] = useState();

  const disconnectWallet = useCallback(() => {
    if (!address) return;
    dispatch(walletSliceActions.disconnect());
    router.push(ROUTES.HOME);
  }, [dispatch, address, router]);

  const getListHistory = useCallback(
    async (address?: string, page = 1) => {
      // let addressArg = '';
      let param = {};
      let addressArgs = '';
      if (!address) {
        param = {
          page,
          limit: 10,
        };
      }
      if (address) {
        const [emitVal, evmError] = handleException(
          address,
          Web3.utils.toChecksumAddress
        );
        if (evmError) addressArgs = address;
        if (emitVal!!!) addressArgs = emitVal;
        param = {
          address: addressArgs,
          page,
          limit: 10,
        };
      }

      const [res, error] = await handleRequest(
        adminService.getAdminHistory(param)
      );
      if (error || !res) {
        if (error.response.data.statusCode === 401) {
          disconnectWallet();
          return;
        }
        sendNotification({
          toastType: 'error',
          options: {
            title: error.response.data.message,
          },
        });
        return;
      }

      // const { data, meta } = await ;
      methods.updateMetaData(res.meta);
      methods.updateData(res.data);
    },
    [methods, disconnectWallet, sendNotification]
  );

  const debounceOnChange = useCallback(
    debounce((value) => {
      setSearchValue(value ? value : undefined);
      methods.updateMetaData({ ...state.pagingData, currentPage: 1 });
    }, 1000),
    []
  );

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isConnected) {
        debounceOnChange(e.currentTarget.value);
      }
    },
    [isConnected, debounceOnChange]
  );
  useEffect(() => {
    if (isConnected) {
      getListHistory(searchValue, state.pagingData.currentPage);
    } else {
      methods.updateMetaData(initPagingDataState.pagingData);
      methods.updateData([]);
    }
  }, [searchValue, state.pagingData.currentPage, isConnected]);

  return {
    handleSearch,
  };
}
