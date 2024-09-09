import axiosService, { AxiosService } from './axiosService';

import { USERS_ENDPOINT } from '@/services/config';

export type SupportedPairResponse = {
  id: number;
  fromChain: string;
  fromSymbol: string;
  fromAddress: string;
  fromDecimal: number;
  fromScAddress: string;
  toChain: string;
  toSymbol: string;
  toAddress: string;
  toDecimal: number;
  toScAddress: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};
export type GetListSpPairsResponse = SupportedPairResponse[];

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
  address: string;
  limit?: number;
  page?: number;
};

export type GetDailyQuotaResponse = {
  dailyQuota: {
    id: number;
    dailyQuota: string;
    tip: string;
    asset: string;
  };
  totalAmountOfToDay: number;
};

class UsersService {
  readonly service: AxiosService;
  readonly baseURL: string = `/users`;

  constructor() {
    this.service = axiosService;
  }

  getListSupportedPairs() {
    return this.service.get<GetListSpPairsResponse>(
      `${this.baseURL}/${USERS_ENDPOINT.SP_PAIRS}`
    );
  }

  getBridgeHistory(query: ParamHistory) {
    return this.service.get<ListHistoryResponse>(
      `${this.baseURL}/${USERS_ENDPOINT.HISTORY}/${query.address}`,
      {
        params: { limit: query.limit, page: query.page },
      }
    );
  }

  getDailyQuota(query: { address: string }) {
    return this.service.get<GetDailyQuotaResponse>(
      `${this.baseURL}/${USERS_ENDPOINT.DAILY_QUOTA}/${query.address}`
    );
  }

  getProtocolFee(payload: { pairId: string | number; amount: string }) {
    return this.service.post<{ amount: string }>(
      `${this.baseURL}/${USERS_ENDPOINT.BRIDGE}/${USERS_ENDPOINT.PROTOCOL_FEE}`,
      {
        pairId: Number(payload.pairId),
        amount: payload.amount,
      }
    );
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new UsersService();
