import { isEqual } from 'lodash';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { DeployValue, useDeployState } from '../context';

import ROUTES from '@/configs/routes';
import { Action } from '@/constants';
import { handleRequest } from '@/helpers/asyncHandlers';
import { isValidAddress } from '@/helpers/common';
import useNotifier from '@/hooks/useNotifier';
import adminService, { TokenDetail } from '@/services/adminService';
import { getWalletSlice, useAppSelector } from '@/store';

function useDeployLogic() {
  const { value, fetchedValue, isLoading, isError } = useDeployState().state;
  const { setValue, setFetchedValue, setIsLoading, setIsLoadingTokenName } =
    useDeployState().methods;

  const { sendNotification } = useNotifier();

  const { isConnected } = useAppSelector(getWalletSlice);

  const router = useRouter();
  const params = useSearchParams();

  const action = useMemo(() => {
    return params.get('action');
  }, [params]);

  const address = useMemo(() => {
    return params.get('address');
  }, [params]);

  const isDisabled = useMemo(() => {
    return (
      isError ||
      !value.assetAddress ||
      !value.assetName ||
      !value.minAmountToBridge ||
      !value.maxAmountToBridge ||
      !value.dailyQuota ||
      !value.bridgeFee ||
      !value.unlockingFee ||
      !value.mintingFee ||
      isEqual(value, fetchedValue)
    );
  }, [value, fetchedValue, isError]);

  const handleDeploy = async () => {
    if (isError || isLoading || !isConnected) return;

    const min = Number(value.minAmountToBridge);
    const max = Number(value.maxAmountToBridge);
    const dailyQuota = Number(value.dailyQuota);
    if (min > max || dailyQuota < max || dailyQuota < min) {
      sendNotification({
        toastType: 'error',
        options: {
          title: 'Invalid amount',
        },
      });
      return;
    }

    const formatValue: TokenDetail = {
      ...value,
      dailyQuota: Number(value.dailyQuota),
      bridgeFee: Number(value.bridgeFee),
    };

    setIsLoading(true);
    const [res, error] = await handleRequest(
      adminService.addAssetToken(formatValue)
    );
    if (error) {
      console.log('🚀 ~ deploy token ~ error:', error);
      return;
    }
    setIsLoading(false);
    sendNotification({
      toastType: 'success',
      options: {
        title: 'Success',
      },
    });
    router.replace(ROUTES.ASSETS);
  };

  const handleReDeploy = async (id: number) => {
    if (isError || isLoading || !isConnected) return;

    setIsLoading(true);
    const [res, error] = await handleRequest(
      adminService.reDeployAssetToken(id)
    );
    if (error) {
      sendNotification({
        toastType: 'error',
        options: {
          title: 'Re deploy failure',
        },
      });
      console.log('🚀 ~ deploy tokenn ~ error:', error);
      return;
    }
    setIsLoading(false);
    sendNotification({
      toastType: 'success',
      options: {
        title: 'Re deploying',
      },
    });
    router.replace(ROUTES.ASSETS);
  };

  const getTokenDetail = async (address: string) => {
    setIsLoading(true);
    const [res, error] = await handleRequest(
      adminService.getAssetTokens({ tokenAddress: address })
    );
    if (!res || error) {
      console.log('Error: ', error);
      return;
    }
    if (res?.data?.length > 0) {
      const data = res.data[0];
      const formValue: DeployValue = {
        ...value,
        assetAddress: data?.fromAddress,
        assetName: data?.asset,
        bridgeFee: data?.bridgeFee && String(Number(data?.bridgeFee)),
        dailyQuota: data?.dailyQuota && String(Number(data?.dailyQuota)),
        mintingFee: data?.mintingFee,
        unlockingFee: data?.unlockingFee,
        // TODO: MIN AND MAX
        // minAmountToBridge: '0',
        // maxAmountToBridge: '0'
      };
      setValue(formValue);
      setFetchedValue(formValue);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (action === Action.CREATE) return;
    if (!address || !isValidAddress(address)) return;
    getTokenDetail(address);
  }, []);

  const getTokenName = async () => {
    if (!value.assetAddress || !isValidAddress(value.assetAddress)) {
      if (!!value.assetName) setValue({ ...value, assetName: '' });
      return;
    }
    if (value.assetAddress) {
      try {
        setIsLoadingTokenName(true);
        const [res, error] = await handleRequest(
          adminService.getAssetNameToken(value.assetAddress)
        );
        console.log('res', res);
        setValue({ ...value, assetName: res?.symbol || '' });
      } catch (error) {
        console.log('Get Symbol Error: ', error);
      } finally {
        setIsLoadingTokenName(false);
      }
    }
  };

  useEffect(() => {
    getTokenName();
  }, [value.assetAddress]);

  return { isDisabled, action, handleDeploy, handleReDeploy };
}

export default useDeployLogic;
