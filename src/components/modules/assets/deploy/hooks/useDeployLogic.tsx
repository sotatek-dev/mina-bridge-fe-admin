import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { useDeployState } from '../context';

import ABITokenErc20 from '@/configs/ABIs/TokenErc20';
import ROUTES from '@/configs/routes';
import { handleRequest } from '@/helpers/asyncHandlers';
import { isValidAddress } from '@/helpers/common';
import Contract from '@/models/contract/evm/contract';
import adminService, { TokenDetail } from '@/services/adminService';
import {
  getWalletInstanceSlice,
  getWalletSlice,
  useAppSelector,
} from '@/store';

function useDeployLogic() {
  const { value, isLoading } = useDeployState().state;
  const { setValue, setIsLoading } = useDeployState().methods;

  const { isConnected } = useAppSelector(getWalletSlice);
  const { networkInstance } = useAppSelector(getWalletInstanceSlice);

  const router = useRouter();

  const isDisabled = useMemo(() => {
    return (
      !value.assetAddress ||
      !value.assetName ||
      !value.minAmountToBridge ||
      !value.maxAmountToBridge ||
      !value.dailyQuota ||
      !value.bridgeFee ||
      !value.unlockingFee ||
      !value.mintingFee
    );
  }, [value]);

  const handleDeploy = async () => {
    if (isLoading || !isConnected) return;

    // Validate...
    const formatValue: TokenDetail = {
      ...value,
      dailyQuota: Number(value.dailyQuota),
      bridgeFee: Number(value.bridgeFee),
    };
    console.log('VALUE', formatValue);
    setIsLoading(true);
    const [res, error] = await handleRequest(
      adminService.addAssetToken(formatValue)
    );
    if (error) {
      console.log('🚀 ~ deploy tokenn ~ error:', error);
      return;
    }
    setIsLoading(false);
    router.replace(ROUTES.ASSETS);
  };

  useEffect(() => {
    if (!value.assetAddress || !isValidAddress(value.assetAddress)) {
      if (!!value.assetName) setValue({ ...value, assetName: '' });
      return;
    }

    const getValue = async () => {
      try {
        const contract = new Contract({
          address: value.assetAddress,
          contractABI: ABITokenErc20,
          provider: (networkInstance.src?.metadata as any)?.provider,
        });
        const assetName = await contract.contractInstance.methods
          .symbol()
          .call();
        console.log('Symbol: ', assetName);
        setValue({ ...value, assetName });
      } catch (error) {
        console.log('Get Symbol Error: ', error);
      }
    };
    getValue();
  }, [value.assetAddress]);

  return { isDisabled, handleDeploy };
}

export default useDeployLogic;
