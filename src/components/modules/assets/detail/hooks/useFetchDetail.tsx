import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { ConfigValue, DetailState, useDetailState } from '../context';

import { handleRequest } from '@/helpers/asyncHandlers';
import { isValidAddress } from '@/helpers/common';
import adminService from '@/services/adminService';

function useFetchDetail() {
  const { setInitValue, setIsInitLoading } = useDetailState().methods;

  const params = useSearchParams();

  const address = useMemo(() => {
    return params.get('address');
  }, [params]);

  const getTokenDetail = async (address: string) => {
    setIsInitLoading(true);
    const [res, error] = await handleRequest(
      adminService.getAssetTokens({ tokenAddress: address })
    );
    if (!res || error) {
      console.log('Error: ', error);
      return;
    }
    if (res?.data?.length > 0) {
      const data = res.data[0];
      const formatViewValue = {
        id: data?.id,
        minaAddress: data?.toAddress || '',
        evmAddress: data?.fromAddress || '',
        assetName: data?.asset || '',
      };
      const formatConfigValue: ConfigValue = {
        bridgeFee: data?.bridgeFee && String(Number(data?.bridgeFee)),
        dailyQuota: data?.dailyQuota && String(Number(data?.dailyQuota)),
        mintingFee: data?.mintingFee,
        unlockingFee: data?.unlockingFee,
      };
      // TODO: min max contract
      const formatMinMaxValue = {
        minAmountToBridge: '0',
        maxAmountToBridge: '0',
      };
      const initValue: DetailState = {
        isLoading: false,
        isInitLoading: false,
        viewValue: formatViewValue,
        minMaxValue: formatMinMaxValue,
        fetchedMinMaxValue: formatMinMaxValue,
        configValue: formatConfigValue,
        fetchedConfigValue: formatConfigValue,
      };
      setInitValue(initValue);
    }
  };

  useEffect(() => {
    if (!address || !isValidAddress(address)) return;
    getTokenDetail(address);
  }, []);
  return true;
}

export default useFetchDetail;
