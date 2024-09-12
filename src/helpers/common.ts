import BigNumber from 'bignumber.js';
import moment from 'moment';

export const isDevelopment = () =>
  process.env.NEXT_PUBLIC_ENV === 'development';
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
    .toFixed();
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
