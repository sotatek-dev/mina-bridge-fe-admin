import axiosService, { AxiosService } from './axiosService';

import { AUTH } from '@/services/config';

export type ResMessage = {
  message: string;
};

export type ResponseAuthToken = {
  accessToken: string;
  refreshToken: string;
};

export type BodyAuthTokenEVM = {
  address: string;
  signature: string | ResponseSignature;
};

export type BodyAuthTokenMina = {
  address: string;
  signature: ResponseSignature;
};

class AuthService {
  readonly service: AxiosService;
  readonly baseURL: string = `auth`;

  constructor() {
    this.service = axiosService;
  }

  getTradingHistory = (query: any) => {
    return this.service.get<any>(`${this.baseURL}${AUTH.LOGIN_ADMIN_ENV}`, {
      params: query,
    });
  };

  getMessage = () => {
    return this.service.get<ResMessage>(
      `${this.baseURL}/${AUTH.LOGIN_MESSAGE}`
    );
  };

  loginAdminEVM = (body: BodyAuthTokenEVM) => {
    return this.service.post<ResponseAuthToken>(
      `${this.baseURL}/${AUTH.LOGIN_ADMIN_ENV}`,
      body
    );
  };

  loginAdminMina = (body: BodyAuthTokenMina) => {
    return this.service.post<ResponseAuthToken>(
      `${this.baseURL}/${AUTH.LOGIN_ADMIN_MINA}`,
      body
    );
  };
}

export default new AuthService();
