'use client';
import { Tbody, Td, Text, Tr } from '@chakra-ui/react';
import _ from 'lodash';
import React from 'react';
import { NumericFormat } from 'react-number-format';

import { useHistoryState } from '../context';

import InfoTransaction from './table.row.infoTx';
import ReceivedTransaction from './table.row.received';
import RowStatus from './table.row.status';

import { formWei, formatDateAndTime, getDecimal } from '@/helpers/common';
import { HistoryResponse } from '@/services/usersService';
import { getWalletInstanceSlice, useAppSelector } from '@/store';

type PropsBodyTable = {
  data: HistoryResponse[];
};

function BodyTable({ data }: PropsBodyTable) {
  const { tip } = useHistoryState().state;
  const { networkInstance } = useAppSelector(getWalletInstanceSlice);

  return (
    <Tbody>
      {data.map((item) => {
        return (
          <Tr key={item.id}>
            <Td borderBottom={'solid 1px #E4E4E7'}>
              <RowStatus status={item.status} networkName={item.networkFrom} />
            </Td>
            <Td borderBottom={'solid 1px #E4E4E7'}>
              <InfoTransaction
                amount={item.amountFrom}
                tokenName={item.tokenFromName}
                txHash={item.txHashLock}
                networkName={item.networkFrom}
                scanUrl={networkInstance.src?.metadata.scanUrl}
              />
            </Td>
            <Td borderBottom={'solid 1px #E4E4E7'}>
              <ReceivedTransaction
                amount={item.amountReceived!!}
                tokenName={item.tokenReceivedName!!}
                txHash={item.txHashUnlock}
                networkName={item.networkReceived}
                amountFrom={item.amountFrom}
                networkFromName={item.networkFrom}
                status={item.status}
                tip={tip}
                scanUrl={networkInstance.tar?.metadata.scanUrl}
              />
            </Td>
            <Td borderBottom={'solid 1px #E4E4E7'}>
              <NumericFormat
                value={
                  item.protocolFee
                    ? formWei(
                        item.protocolFee,
                        getDecimal(item.networkReceived)
                      )
                    : '0.00'
                }
                thousandSeparator={','}
                decimalScale={4}
                decimalSeparator={'.'}
                displayType={'text'}
                renderText={(value) => (
                  <Text variant={'lg'} color={'text.900'}>
                    {`${value} ${_.isEmpty(item.tokenReceivedName) ? '' : item.tokenReceivedName}`}
                  </Text>
                )}
              />
              <Text variant={'md'} color={'text.500'}>
                {formatDateAndTime(item.blockTimeLock)}
              </Text>
            </Td>
            <Td borderBottom={'solid 1px #E4E4E7'}>
              <Text variant={'lg'} color={'text.900'}>
                {item.id}
              </Text>
            </Td>
          </Tr>
        );
      })}
    </Tbody>
  );
}

export default BodyTable;
