const CoinGeckoSV = {
  simple: {
    price: 'simple_price',
  },
  coins: {
    regular: 'coins',
    contract: 'coins_contract',
    list: 'coins_list',
  },
};
const PairDetailSV = {
  tradeHistory: 'th',
  chartHistory: 'ch',
  pairReaction: 'pr',
  pairReactVote: 'prv',
};

const PairSV = {
  pairsByQuery: 'pbq',
  pairs: 'pairs',
  pairInfo: 'pi',
};

enum USERS_ENDPOINT {
  SP_PAIRS = 'list-supported-pairs',
  HISTORY = 'history',
  DAILY_QUOTA = 'daily-quota',
  BRIDGE = 'bridge',
  PROTOCOL_FEE = 'protocol-fee',
}

enum ADMIN_ENDPOINT {
  HISTORY = 'history',
  COMMON_CONFIG = 'common-config',
  UPDATE_COMMON_CONFIG = 'update-common-config',
  GET_TOKENS = 'tokens',
  UPDATE_TOKEN = 'token',
  ADD_TOKEN = 'new-token',
  UPDATE_STATUS = 'token/visibility',
  RE_DEPLOY = 'token/re-deploy',
  ASSET_NAME = 'token-name',
}

enum AUTH {
  LOGIN_ADMIN_ENV = 'login-admin-evm',
  LOGIN_ADMIN_MINA = 'login-admin-mina',
  LOGIN_MESSAGE = 'admin/login-message',
  REFRESH_TOKEN = 'refresh-token',
}

export {
  CoinGeckoSV,
  PairDetailSV,
  PairSV,
  USERS_ENDPOINT,
  ADMIN_ENDPOINT,
  AUTH,
};
