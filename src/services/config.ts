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

export { CoinGeckoSV, PairDetailSV, PairSV, USERS_ENDPOINT };
