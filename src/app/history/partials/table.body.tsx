'use client';
import { Tbody, Td, Text, Tr } from '@chakra-ui/react';
import _ from 'lodash';
import React from 'react';

import InfoTransaction from './table.row.infoTx';
import RowStatus from './table.row.status';

import {
  formatAmount,
  formatDateAndTime,
  getDecimal,
  getScanUrl,
} from '@/helpers/common';
import { HistoryResponse } from '@/services/usersService';

type PropsBodyTable = {
  data: HistoryResponse[];
};

function BodyTable({ data }: PropsBodyTable) {
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
                scanUrl={getScanUrl(item.networkFrom)}
              />
            </Td>
            <Td borderBottom={'solid 1px #E4E4E7'}>
              <InfoTransaction
                amount={item.amountReceived!!}
                tokenName={item.tokenReceivedName!!}
                txHash={item.txHashUnlock}
                networkName={item.networkReceived}
                scanUrl={getScanUrl(item.networkReceived)}
              />
            </Td>
            <Td borderBottom={'solid 1px #E4E4E7'}>
              <Text variant={'lg'} color={'text.900'}>
                {`${
                  item.protocolFee
                    ? formatAmount(
                        getDecimal(item.networkReceived),
                        item.protocolFee
                      )
                    : '0.00'
                } ${_.isEmpty(item.tokenReceivedName) ? '' : item.tokenReceivedName}`}
              </Text>
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
