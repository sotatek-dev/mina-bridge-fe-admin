import axiosService, { AxiosService } from './axiosService';

import { ADMIN_ENDPOINT } from '@/services/config';

export enum STATUS {
  ENABLE = 'enable',
  DISABLE = 'disable',
  CREATED = 'created',
  DEPLOYING = 'deploying',
  FAILED = 'deploy_failed',
}

export type HistoryResponse = {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  senderAddress: string;
  amountFrom: string;
  tokenFromAddress: string;
  networkFrom: string;
  tokenFromName: string;
  txHashLock: string;
  receiveAddress: string;
  amountReceived: string | null;
  tokenReceivedAddress: string;
  networkReceived: string;
  tokenReceivedName: string | null;
  txHashUnlock: string | null;
  blockNumber: string;
  blockTimeLock: string;
  protocolFee: string | null;
  tip: string;
  gasFee: string;
  event: string;
  returnValues: string;
  errorDetail: string | null;
  status: string;
  retry: number;
};

export type MetaDataHistory = {
  total: number;
  totalOfPages: number;
  perPage?: number;
  currentPage?: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type TokenResponse = {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  dailyQuota: string;
  bridgeFee: string;
  mintingFee: string;
  unlockingFee: string;
  asset: string;
  totalWethMinted: string;
  totalWethBurnt: string;
  fromChain: string;
  toChain: string;
  fromSymbol: string;
  toSymbol: string;
  fromAddress: string;
  toAddress: string;
  fromDecimal: number;
  toDecimal: number;
  fromScAddress: string;
  toScAddress: string;
  status: STATUS;
  isHidden: boolean;
};

export type ListHistoryResponse = {
  data: HistoryResponse[];
  meta: MetaDataHistory;
};

export type ListTokenResponse = {
  data: TokenResponse[];
  meta: MetaDataHistory;
};

export type ParamHistory = {
  address?: string;
  limit?: number;
  page?: number;
};

export type ParamTokens = {
  limit?: number;
  page?: number;
};

export type ParamCommonConfig = {
  id: number;
  tip: number;
  dailyQuota: number;
  feeUnlockMina: string;
  feeUnlockEth: string;
};

export type CommonConfigResponse = {
  id: number;
  dailyQuota: string;
  tip: string;
  asset: string;
  feeUnlockMina: string;
  feeUnlockEth: string;
};

export type TokenDetail = {
  assetAddress: string;
  assetName: string;
  minAmountToBridge: string;
  maxAmountToBridge: string;
  dailyQuota: number;
  bridgeFee: number;
  unlockingFee: string;
  mintingFee: string;
};

class AdminService {
  readonly service: AxiosService;
  readonly baseURL: string = 'admin';

  constructor() {
    this.service = axiosService;
  }

  getAdminHistory(params: ParamHistory) {
    return this.service.getAuth<ListHistoryResponse>(
      `${this.baseURL}/${ADMIN_ENDPOINT.HISTORY}`,
      {
        params,
      }
    );
  }

  getCommonConfig() {
    return this.service.getAuth<CommonConfigResponse>(
      `${this.baseURL}/${ADMIN_ENDPOINT.COMMON_CONFIG}`
    );
  }

  updateCommonConfig({ id, ...config }: ParamCommonConfig) {
    return this.service.putAuth<any>(
      `${this.baseURL}/${ADMIN_ENDPOINT.UPDATE_COMMON_CONFIG}/${id}`,
      config
    );
  }

  getAssetTokens(params: ParamHistory) {
    return this.service.getAuth<any>(
      `${this.baseURL}/${ADMIN_ENDPOINT.GET_TOKENS}`,
      {
        params,
      }
    );
  }

  addAssetToken(body: TokenDetail) {
    return this.service.postAuth<ListTokenResponse>(
      `${this.baseURL}/${ADMIN_ENDPOINT.ADD_TOKEN}`,
      body
    );
  }

  updateStatusToken({ id, isHidden }: { id: number; isHidden: boolean }) {
    return this.service.putAuth<any>(
      `${this.baseURL}/${ADMIN_ENDPOINT.UPDATE_STATUS}/${id}`,
      {
        isHidden: isHidden,
      }
    );
  }
}

const adminService = new AdminService();
export default adminService;
