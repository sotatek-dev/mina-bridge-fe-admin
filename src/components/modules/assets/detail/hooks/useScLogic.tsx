import { isEqual } from 'lodash';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { useDetailState } from '../context';

import ROUTES from '@/configs/routes';
import { handleRequest } from '@/helpers/asyncHandlers';
import useNotifier from '@/hooks/useNotifier';
import adminService, { TokenDetail } from '@/services/adminService';
import { getWalletSlice, useAppSelector } from '@/store';

function useScLogic() {
  const { isLoading, minMaxValue, fetchedMinMaxValue } = useDetailState().state;
  const { setIsLoading } = useDetailState().methods;

  const { sendNotification } = useNotifier();

  const { isConnected } = useAppSelector(getWalletSlice);

  const router = useRouter();

  const minMaxDisable = useMemo(() => {
    return (
      !minMaxValue.minAmountToBridge ||
      !minMaxValue.maxAmountToBridge ||
      isEqual(minMaxValue, fetchedMinMaxValue)
    );
  }, [minMaxValue, fetchedMinMaxValue]);

  const handleUpdateMinMax = async () => {
    // if (isError || isLoading || !isConnected) return;
    // const min = Number(value.minAmountToBridge);
    // const max = Number(value.maxAmountToBridge);
    // const dailyQuota = Number(value.dailyQuota);
    // if (min >= max || dailyQuota < max || dailyQuota < min) {
    //   sendNotification({
    //     toastType: 'error',
    //     options: {
    //       title: 'Invalid amount',
    //     },
    //   });
    //   return;
    // }
    // const formatValue: TokenDetail = {
    //   ...value,
    //   dailyQuota: Number(value.dailyQuota),
    //   bridgeFee: Number(value.bridgeFee),
    // };
    // setIsLoading(true);
    // const [res, error] = await handleRequest(
    //   adminService.addAssetToken(formatValue)
    // );
    // if (error) {
    //   console.log('🚀 ~ deploy tokenn ~ error:', error);
    //   return;
    // }
    // setIsLoading(false);
    // router.replace(ROUTES.ASSETS);
  };

  return { minMaxDisable, handleUpdateMinMax };
}

export default useScLogic;
