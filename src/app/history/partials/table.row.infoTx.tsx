'use client';
import { Link, Text } from '@chakra-ui/react';
import _ from 'lodash';
import React from 'react';
import { NumericFormat } from 'react-number-format';

import {
  formWei,
  getDecimal,
  truncateMid,
  zeroCutterEnd,
} from '@/helpers/common';

type InfoTransactionProps = {
  amount: string;
  tokenName: string;
  txHash: string | null;
  networkName: string;
  scanUrl?: string;
};

function InfoTransaction({
  amount,
  tokenName,
  txHash,
  networkName,
  scanUrl,
}: InfoTransactionProps) {
  const [fSlice, sSlice] = !txHash ? ['', ''] : truncateMid(txHash, 4, 4);

  return (
    <>
      {amount ? (
        <NumericFormat
          value={formWei(amount, getDecimal(networkName))}
          thousandSeparator={','}
          decimalScale={4}
          decimalSeparator={'.'}
          displayType={'text'}
          renderText={(value) => (
            <Text variant={'lg'} color={'text.900'}>
              {`${zeroCutterEnd(value)} ${_.isEmpty(tokenName) ? '' : tokenName}`}
            </Text>
          )}
        />
      ) : (
        '0.00'
      )}

      {txHash && scanUrl && (
        <Link href={`${scanUrl}/tx/${txHash}`} target={'_blank'}>
          <Text variant={'md'} color={'text.500'} whiteSpace={'nowrap'}>
            {`${fSlice}...${sSlice} (${networkName.toUpperCase()})`}
          </Text>
        </Link>
      )}
    </>
  );
}

export default InfoTransaction;
