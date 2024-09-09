type GetSnapResponse = Record<string, { id: string; version: string }>;

type ResponseAccountInfo = {
  balance: {
    total: string;
  };
  delegateAccount: {
    publicKey: string;
  };
  inferredNonce: string;
  name: string;
  nonce: string;
  publicKey: string;
};

type GetListAccountResponse = {
  name: string;
  address: string;
  index: string;
  isImported: boolean;
  balance: {
    total: string;
  };
};

type GetListAccountsResponse = Array<GetListAccountResponse>;

type ResponseNetworkConfig = {
  name: string;
  gqlUrl: string;
  gqlTxUrl: string;
  explorerUrl: string;
  token: {
    name: string;
    coinType: number;
    symbol: string;
    decimals: number;
  };
};
