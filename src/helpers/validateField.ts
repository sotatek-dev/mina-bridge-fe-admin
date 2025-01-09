import { handleRequest } from './asyncHandlers';
import { isValidAddress } from './common';

import adminService from '@/services/adminService';

export const validateAddress = async (
  address: string,
  skipAddress?: string
) => {
  if (!address.trim()) {
    return 'Please enter contract address of token on Ethereum';
  }

  if (!isValidAddress(address.trim())) {
    return 'Address is invalid';
  }

  if (skipAddress && address === skipAddress) return '';

  // TODO: check "This asset is already deployed"
  const [res, error] = await handleRequest(
    adminService.getAssetTokens({ tokenAddress: address })
  );
  if (!res || error) return '';
  if (res?.data?.length > 0) return 'This asset is already deployed';

  return '';
};
