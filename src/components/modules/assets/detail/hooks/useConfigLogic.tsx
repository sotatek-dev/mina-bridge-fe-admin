import { isEqual } from 'lodash';
import { useMemo } from 'react';

import { useDetailState } from '../context';

import { handleRequest } from '@/helpers/asyncHandlers';
import useNotifier from '@/hooks/useNotifier';
import adminService, { ParamTokenConfig } from '@/services/adminService';
import { getWalletSlice, useAppSelector } from '@/store';

function useConfigLogic() {
  const { isLoading, configValue, fetchedConfigValue, viewValue } =
    useDetailState().state;
  const { setIsLoading, setFetchedConfigValue } = useDetailState().methods;

  const { sendNotification } = useNotifier();

  const { isConnected } = useAppSelector(getWalletSlice);

  const configDisable = useMemo(() => {
    return (
      !configValue.bridgeFee ||
      !configValue.dailyQuota ||
      !configValue.mintingFee ||
      !configValue.unlockingFee ||
      isEqual(configValue, fetchedConfigValue)
    );
  }, [configValue, fetchedConfigValue]);

  const handleUpdateConfig = async () => {
    if (isLoading || !isConnected) return;

    const data: ParamTokenConfig = {
      ...configValue,
      dailyQuota: Number(configValue.dailyQuota),
      bridgeFee: Number(configValue.bridgeFee),
      id: viewValue.id,
    };
    setIsLoading(true);
    const [res, error] = await handleRequest(
      adminService.updateAssetToken(data)
    );
    if (error) {
      console.log('🚀 ~  update config token ~ error:', error);
      sendNotification({
        toastType: 'error',
        options: {
          title: 'There is something wrong',
        },
      });
      return;
    }
    setIsLoading(false);
    setFetchedConfigValue(configValue);
    sendNotification({
      toastType: 'success',
      options: {
        title: 'Update successfully',
      },
    });
  };

  return { configDisable, handleUpdateConfig };
}

export default useConfigLogic;
