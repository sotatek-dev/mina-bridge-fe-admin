import axiosService, { AxiosService } from './axiosService';

import { ADMIN_ENDPOINT } from '@/services/config';

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

export type ListHistoryResponse = {
  data: HistoryResponse[];
  meta: MetaDataHistory;
};

export type ParamHistory = {
  address?: string;
  limit?: number;
  page?: number;
};

export type ParamCommonConfig = {
  id: number;
  tip: number;
  dailyQuotaPerAddress: number;
  dailyQuotaSystem: number;
  feeUnlockMina: string;
  feeUnlockEth: string;
};

export type CommonConfigResponse = {
  id: number;
  dailyQuotaPerAddress: string;
  dailyQuotaSystem: string;
  tip: string;
  asset: string;
  feeUnlockMina: string;
  feeUnlockEth: string;
};

export type SignMinaConfigBody = {
  min: string;
  max: string;
  address: string;
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

  signMinaConfigMinMax(body: SignMinaConfigBody) {
    return this.service.postAuth<{ jsonTx: Object }>(
      `${this.baseURL}/${ADMIN_ENDPOINT.SIGN_MINA_CONFIG}`,
      body
    );
  }
}

const adminService = new AdminService();
export default adminService;
