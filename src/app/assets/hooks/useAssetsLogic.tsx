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

export default function useAssetLogic() {
  const { methods, state } = useAssetsState();
  const { isConnected } = useAppSelector(getWalletSlice);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { sendNotification } = useNotifier();
  const [searchValue, setSearchValue] = useState('');

  const disconnectWallet = useCallback(() => {
    dispatch(walletSliceActions.disconnect());
    router.push(ROUTES.HOME);
  }, [dispatch, router]);

  const getListAssets = useCallback(
    async (searchValue: string, page = 1) => {
      let params = {};
      if (!searchValue) {
        params = {
          page,
          limit: 10,
        };
      } else {
        params = {
          // address: addressArgs,
          page,
          limit: 10,
        };
      }

      const [res, error] = await handleRequest(
        adminService.getAssetTokens(params)
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

      methods.updateMetaData(res.meta);
      methods.updateData(res.data);
    },
    [methods, disconnectWallet, sendNotification]
  );

  // const debounceOnChange = useCallback(
  //   debounce((value) => {
  //     setSearchValue(value ? value : undefined);
  //     methods.updateMetaData({ ...state.pagingData, currentPage: 1 });
  //   }, 1000),
  //   []
  // );

  // const handleSearch = useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     if (isConnected) {
  //       debounceOnChange(e.currentTarget.value);
  //     }
  //   },
  //   [isConnected, debounceOnChange]
  // );
  useEffect(() => {
    if (isConnected) {
      getListAssets(searchValue, state.pagingData.currentPage);
    } else {
      methods.updateMetaData(initPagingDataState.pagingData);
      methods.updateData([]);
    }
  }, [searchValue, state.pagingData.currentPage, isConnected]);

  return {
    // handleSearch,
  };
}
