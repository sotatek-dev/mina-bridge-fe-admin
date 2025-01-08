'use client';
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { useAssetsState } from '../context';

import ROUTES from '@/configs/routes';
import { handleRequest } from '@/helpers/asyncHandlers';
import useNotifier from '@/hooks/useNotifier';
import adminService from '@/services/adminService';
import { getWalletSlice, useAppDispatch, useAppSelector } from '@/store';
import { walletSliceActions } from '@/store/slices/walletSlice';

export default function useAssetLogic() {
  const { methods } = useAssetsState();
  const { isConnected } = useAppSelector(getWalletSlice);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { sendNotification } = useNotifier();

  const disconnectWallet = useCallback(() => {
    dispatch(walletSliceActions.disconnect());
    router.push(ROUTES.HOME);
  }, [dispatch, router]);

  const getListAssets = useCallback(
    async (search?: string, page?: number) => {
      let params = {
        assetName: search,
        page: page,
        limit: 10,
      };

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

  const debounceOnChange = useCallback(
    debounce((value) => {
      getListAssets(value, 1);
    }, 1000),
    [methods]
  );

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isConnected) {
        debounceOnChange(e.currentTarget.value);
      }
    },
    [isConnected, debounceOnChange]
  );

  const toggleHideShowAsset = useCallback(
    async (e: any) => {
      if (isConnected) {
        const [res, error] = await handleRequest(
          adminService.updateStatusToken({
            id: e.id,
            isHidden: !e.isHidden,
          })
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
        } else {
          sendNotification({
            toastType: 'success',
            options: {
              title: e.isHidden
                ? 'Show token successfully'
                : 'Hide token successfully',
            },
          });
          getListAssets();
        }
      }
    },
    [isConnected]
  );

  const handleChangeCurrentPage = useCallback(
    (page: number) => {
      if (isConnected) {
        getListAssets('', page);
      }
    },
    [isConnected]
  );

  return {
    getListAssets,
    handleSearch,
    toggleHideShowAsset,
    handleChangeCurrentPage,
  };
}
