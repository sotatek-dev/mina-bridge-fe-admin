'use client';
import { Link, Text } from '@chakra-ui/react';
import _ from 'lodash';
import React from 'react';
import { NumericFormat } from 'react-number-format';

import {
  calculateAmountReceived,
  formWei,
  getDecimal,
  truncateMid,
} from '@/helpers/common';

type ReceivedTransactionProps = {
  amount: string;
  tokenName: string;
  txHash: string | null;
  networkName: string;
  status: string;
  amountFrom: string;
  networkFromName: string;
  tip: string;
  scanUrl?: string;
};

function ReceivedTransaction({
  amount,
  tokenName,
  txHash,
  networkName,
  status,
  amountFrom,
  networkFromName,
  tip,
  scanUrl,
}: ReceivedTransactionProps) {
  const [fSlice, sSlice] = !txHash ? ['', ''] : truncateMid(txHash, 4, 4);
  const amountSend = amountFrom
    ? formWei(amountFrom, getDecimal(networkFromName))
    : '0.00';

  return (
    <>
      <NumericFormat
        value={amount ? formWei(amount, getDecimal(networkName)) : '0.00'}
        thousandSeparator={','}
        decimalScale={4}
        decimalSeparator={'.'}
        displayType={'text'}
        renderText={(value) =>
          status === 'failed' ? (
            <Text variant={'lg'} color={'text.900'}>
              {`${value} ${_.isEmpty(tokenName) ? '' : tokenName}`}
            </Text>
          ) : (
            <Text variant={'lg'} color={'text.900'}>
              {`${calculateAmountReceived(Number(amountSend), Number(tip))} ${networkName === 'eth' ? 'ETH' : 'WETH'}`}
            </Text>
          )
        }
      />
      {txHash && scanUrl && (
        <Link href={`${scanUrl}/tx/${txHash}`} target={'_blank'}>
          <Text variant={'md'} color={'text.500'}>
            {`${fSlice}...${sSlice} (${networkName.toUpperCase()})`}
          </Text>
        </Link>
      )}
    </>
  );
}

export default ReceivedTransaction;
