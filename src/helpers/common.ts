import BigNumber from 'bignumber.js';
import moment from 'moment';

import { ListFileName, ZkContractType } from '@/configs/constants';

export const getMinaNetworkId = () => {
  return process.env.NEXT_PUBLIC_ENV === 'production' ? 'mainnet' : 'testnet';
};
export const getMinaProxyUrl = () => {
  return process.env.NEXT_PUBLIC_ENV === 'production'
    ? process.env.NEXT_PUBLIC_REQUIRED_MINA_RPC_MAINNET!
    : process.env.NEXT_PUBLIC_REQUIRED_MINA_RPC_DEVNET!;
};

export const isDevelopment = () =>
  process.env.NEXT_PUBLIC_ENV === 'development';
export const isFnc = <F>(maybeFnc: F | unknown): maybeFnc is F =>
  typeof maybeFnc === 'function';

export const truncateMid = (src: string, start: number, end: number) => [
  src.slice(0, start),
  src.slice(src.length - end, src.length),
];

export const truncatedNumber = (value: string, minumumNumber = 0.0001) => {
  const maxDecimal = minumumNumber.toString().split('.')[1].length;

  if (BigNumber(value).isEqualTo(0)) {
    return value;
  }

  if (BigNumber(value).lt(minumumNumber)) {
    return '<' + minumumNumber;
  }
  return new BigNumber(value || 0)
    .shiftedBy(0)
    .decimalPlaces(maxDecimal)
    .toFormat();
};

export const toWei = (
  amount: string | number,
  decimal: string | number
): string => {
  decimal = typeof decimal === 'number' ? decimal : parseInt(decimal);
  return new BigNumber(amount)
    .multipliedBy(new BigNumber('1' + '0'.repeat(decimal)))
    .toFixed();
};

export const formWei = (amount: string | number, decimal: string | number) => {
  decimal = typeof decimal === 'number' ? decimal : parseInt(decimal);
  if (decimal != 0) {
    const amountToBN = new BigNumber(amount);
    let decimalPow = '1' + '0'.repeat(decimal);

    const decimalToBN = new BigNumber(decimalPow);
    const newAmount = amountToBN.dividedBy(decimalToBN);
    if (newAmount.isLessThan(0.0001)) return '0';
    return zeroCutterEnd(newAmount.toString());
  }

  if (amount.toString()?.indexOf('.') != -1) {
    amount = typeof amount === 'string' ? Number(amount) : amount;
    return (amount - (amount % 1) + 1).toString();
  }
  return zeroCutterEnd(amount.toString());
};

export const formatDateAndTime = (timestamp: string) => {
  const date = moment.unix(Number(timestamp));
  return date.format('YYYY-MM-DD HH:mm:ss');
};

export const formatDate = (datetime: string | number) => {
  return moment(datetime).format('YYYY-MM-DD');
};

export const formatTime = (datetime: string | number) => {
  return moment(datetime).format('HH:mm:ss');
};

export const getDecimal = (network: string) => {
  // response from api not match defined enum NETWORK_NAME
  const NETWORK_NAME = {
    MINA: 'mina',
    ETHER: 'eth',
  };
  switch (network) {
    case NETWORK_NAME.MINA:
      return 9;
    case NETWORK_NAME.ETHER:
      return 18;
    default:
      return 18;
  }
};

export function formatNumber(
  balance: string,
  decimals: string | number,
  roundMode: BigNumber.RoundingMode = BigNumber.ROUND_HALF_UP
) {
  const balBN = new BigNumber(balance);
  const decNum = Number(decimals);
  if (decNum > 4) {
    return balBN.dp(4, roundMode).toString(10);
  }
  return balBN.dp(decNum, roundMode).toString(10);
}

export function formatAmount(decimals: number, amount: string) {
  const minimumNumber =
    decimals > 4 ? new BigNumber(10).pow(-4) : new BigNumber(10).pow(-decimals);

  const amountBN = new BigNumber(amount).div(new BigNumber(10).pow(decimals));

  if (amountBN.lt(minimumNumber)) {
    return `<${minimumNumber.toString()}`;
  }

  return formatNumber(amountBN.toString(), decimals);
}

export const zeroCutterEnd = (value: string) => {
  const dotIndex = value.indexOf('.');
  if (dotIndex < 1) return value;

  let lastZeroIndex = 0;

  for (let i = value.length - 1; i >= 0; i--) {
    if (value.charAt(i) === '.') {
      lastZeroIndex = i;
      break;
    }
    if (value.charAt(i) !== '0') {
      lastZeroIndex = i + 1;
      break;
    }
  }
  return value.substring(0, lastZeroIndex);
};

export const zeroCutterStart = (value: string) => {
  if (value.indexOf('.') === 0) return '0' + value;
  return value.replace(/^0+/, '0');
};

export function getDecimalPosition(value: string) {
  // Find the position of the decimal point
  const decimalPosition = value.indexOf('.');
  // Return the position, or -1 if there is no decimal point
  return decimalPosition !== -1 ? decimalPosition + 1 : -1;
}

export function calculateAmountReceived(
  amountFrom: number,
  percentTip: number
) {
  // Ensure percentTip is within a valid range (0-100)
  if (percentTip < 0 || percentTip > 100) {
    throw new Error('Percent tip must be between 0 and 100');
  }

  // Convert percentTip to a decimal
  const tipDecimal = percentTip / 100;

  // Calculate the amount received using the formula
  const amountReceived = amountFrom - amountFrom * tipDecimal;

  return amountReceived;
}

export function fetchFiles(type: ZkContractType) {
  const listFiles = ListFileName[type];

  const publicStaticUri = process.env.NEXT_PUBLIC_BASE_PUBLIC_STATIC_URI || '';

  // if (publicStaticUri) {
  //   return Promise.all(
  //     listFiles.map((file) => {
  //       return Promise.all([
  //         fetch(`${publicStaticUri}/o1js/${file}.header`).then((res) =>
  //           res.text()
  //         ),
  //         fetch(`${publicStaticUri}/o1js/${file}`).then((res) => res.text()),
  //       ]).then(([header, data]) => ({ file, header, data }));
  //     })
  //   ).then((cacheList) =>
  //     cacheList.reduce((acc: any, { file, header, data }) => {
  //       acc[file] = { file, header, data };
  //       return acc;
  //     }, {})
  //   );
  // }

  return Promise.all(
    listFiles.map((file) => {
      return Promise.all([
        fetch(`/caches/o1js/${file}.header`).then((res) => res.text()),
        fetch(`/caches/o1js/${file}`).then((res) => res.text()),
      ]).then(([header, data]) => ({ file, header, data }));
    })
  ).then((cacheList) =>
    cacheList.reduce((acc: any, { file, header, data }) => {
      acc[file] = { file, header, data };
      return acc;
    }, {})
  );
}

export function fileSystem(files: any) {
  return {
    read({ persistentId, uniqueId, dataType }: any) {
      // read current uniqueId, return data if it matches
      if (!files[persistentId]) {
        return undefined;
      }

      if (dataType === 'string') {
        return new TextEncoder().encode(files[persistentId].data);
      }

      return undefined;
    },
    write() {
      // console.log('write');
    },
    canWrite: true,
  };
}

export function getScanUrl(networkName: string) {
  // response from api not match defined enum NETWORK_NAME
  const NETWORK_NAME = {
    MINA: 'mina',
    ETHER: 'eth',
  };

  return networkName === NETWORK_NAME.MINA
    ? process.env.NEXT_PUBLIC_REQUIRED_MINA_SCAN_URL
    : process.env.NEXT_PUBLIC_REQUIRED_ETH_SCAN_URL;
}
