'use client';
import { Box, Switch, Tbody, Td, Text, Tr } from '@chakra-ui/react';
import _ from 'lodash';
import { useRouter } from 'next/navigation';
import React from 'react';

import InfoTransaction from './table.row.infoTx';
import RowStatus, { STATUS } from './table.row.status';

import { Action } from '@/constants';
import {
  formatDate,
  formatTime,
  getScanUrl,
  truncatedNumber,
} from '@/helpers/common';
import { HistoryResponse } from '@/services/usersService';

type PropsBodyTable = {
  data: HistoryResponse[];
};

function BodyTable({ data }: PropsBodyTable) {
  const router = useRouter();
  return (
    <Tbody>
      {data.map((item) => {
        return (
          <Tr
            key={item.id}
            cursor={'pointer'}
            onClick={(e) => router.push(`?action=${Action.DETAIL}`)}
          >
            <Td borderBottom={'solid 1px #E4E4E7'}>
              <div onClick={(e) => e.stopPropagation()}>
                <RowStatus
                  status={item.status}
                  networkName={item.networkFrom}
                />
              </div>
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
              <Text variant={'lg'} color={'text.900'} whiteSpace={'nowrap'}>
                {`${truncatedNumber(
                  item.tip ? item.tip : '0.00'
                )} ${!item?.tip || _.isEmpty(item.tokenFromName) ? '' : item.tokenFromName}`}
              </Text>
            </Td>
            <Td borderBottom={'solid 1px #E4E4E7'}>
              <Text variant={'lg'} color={'text.900'} whiteSpace={'nowrap'}>
                {`${truncatedNumber(
                  item.gasFee ? item.gasFee : '0.00'
                )} ${!item?.gasFee || _.isEmpty(item.tokenFromName) ? '' : item.tokenFromName}`}
              </Text>
            </Td>
            <Td borderBottom={'solid 1px #E4E4E7'} width={100}>
              <Text variant={'lg'} color={'text.900'} whiteSpace={'nowrap'}>
                {formatDate(Number(item.blockTimeLock) * 1000)}
              </Text>
              <Text variant={'lg'} color={'text.900'} whiteSpace={'nowrap'}>
                {formatTime(Number(item.blockTimeLock) * 1000)}
              </Text>
            </Td>
            <Td borderBottom={'solid 1px #E4E4E7'}>
              {item?.status === STATUS.COMPLETED && item?.updatedAt && (
                <>
                  <Text variant={'lg'} color={'text.900'} whiteSpace={'nowrap'}>
                    {formatDate(item?.updatedAt)}
                  </Text>
                  <Text variant={'lg'} color={'text.900'} whiteSpace={'nowrap'}>
                    {formatTime(item?.updatedAt)}
                  </Text>
                </>
              )}
            </Td>
            <Td borderBottom={'solid 1px #E4E4E7'}>
              <Box onClick={(e) => e.stopPropagation()} w={'fit-content'}>
                <Switch
                  sx={{
                    '.chakra-switch__track[data-checked]': {
                      backgroundColor: 'primary.purple',
                    },
                  }}
                />
              </Box>
            </Td>
          </Tr>
        );
      })}
    </Tbody>
  );
}

export default BodyTable;
