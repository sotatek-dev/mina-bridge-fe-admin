import BigNumber from 'bignumber.js';
import moment from 'moment';

import { ListFileName, ZkContractType } from '@/configs/constants';
BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_DOWN });

export const isDevelopment = () => process.env.NEXT_PUBLIC_ENV === 'development';
export const isFnc = <F>(maybeFnc: F | unknown): maybeFnc is F =>
  typeof maybeFnc === 'function';

export const truncateMid = (src: string, start: number, end: number) => [
  src.slice(0, start),
  src.slice(src.length - end, src.length),
];

export const toWei = (
  amount: string | number,
  decimal: string | number
): string => {
  decimal = typeof decimal === 'number' ? decimal : parseInt(decimal);
  return new BigNumber(amount)
    .multipliedBy(new BigNumber('1' + '0'.repeat(decimal)))
    .toString();
};

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

export const formWei = (amount: string | number, decimal: string | number) => {
  decimal = typeof decimal === 'number' ? decimal : parseInt(decimal);
  if (decimal != 0) {
    const amountToBN = new BigNumber(amount);
    let decimalPow = '1' + '0'.repeat(decimal);

    const decimalToBN = new BigNumber(decimalPow);
    const newAmount = amountToBN.dividedBy(decimalToBN);
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

export function formatNumber(balance: string, decimals: string | number) {
  const balBN = new BigNumber(balance);
  const decNum = Number(decimals);
  if (decNum > 4) {
    return zeroCutterEnd(balBN.toFixed(4));
  }
  return zeroCutterEnd(balBN.toFixed(decNum));
}

export function formatNumber2(
  balance: string,
  decimals: string | number,
  prefixCharacter?: string
) {
  const balBN = new BigNumber(balance);
  const decNum = Number(decimals);

  let value = '0';
  if (decNum > 4) {
    value = truncatedNumber(balBN.toFixed(4));
  } else {
    value = truncatedNumber(balBN.toFixed(decNum));
  }

  if (value.includes('<')) {
    return value;
  }

  if (prefixCharacter) {
    return prefixCharacter + value;
  }
  return value;
}

export const zeroCutterStart = (value: string) => {
  if (value.indexOf('.') === 0) return '0' + value;
  return value.replace(/^0+/, '0');
};

export function bnMinus(srcVal: string | number, tarVal: string | number) {
  return new BigNumber(srcVal).minus(new BigNumber(tarVal));
}
export function bnAdd(srcVal: string | number, tarVal: string | number) {
  return new BigNumber(srcVal).plus(new BigNumber(tarVal));
}

export function bnMul(srcVal: string | number, tarVal: string | number) {
  return new BigNumber(srcVal).multipliedBy(new BigNumber(tarVal));
}

export function toAbsoluteUrl(pathname: string) {
  return window.location.origin + pathname;
}

export function getPxFromUrl(url?: string) {
  if (!url) return 'full';
  const match = url.match(/-(\d+px)\.png$/);
  if (!match) return 'full';
  return match[1];
}

export function fetchFiles(type: ZkContractType) {
  const listFiles = ListFileName[type];
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
