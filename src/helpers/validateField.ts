import { handleRequest } from './asyncHandlers';
import { isValidAddress } from './common';

import adminService from '@/services/adminService';

export const validateAddress = async (address: string) => {
  if (!address.trim()) {
    return 'Please enter contract address of token on Ethereum';
  }

  if (!isValidAddress(address.trim())) {
    return 'Address is invalid';
  }

  // TODO: check "This asset is already deployed"
  // const [res, error] = await handleRequest(
  //   adminService.getAssetTokens(address)
  // );
  // console.log('Res: ', res);

  return '';
};
