import axiosService, { AxiosService } from './axiosService';

import { USERS_ENDPOINT } from '@/services/config';

class ExampleService {
  readonly service: AxiosService;
  readonly baseURL: string = `example`;

  constructor() {
    this.service = axiosService;
  }

  getTradingHistory = (query: any) => {
    return this.service.get<any>(`${this.baseURL}${USERS_ENDPOINT.HISTORY}`, {
      params: query,
    });
  };
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new ExampleService();
