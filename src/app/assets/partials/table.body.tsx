'use client';
import { Box, Switch, Tbody, Td, Text, Tr } from '@chakra-ui/react';
import _ from 'lodash';
import { useRouter } from 'next/navigation';
import React from 'react';

import AddressInfo from './table.row.infoTx';
import RowStatus from './table.row.status';

import { Action } from '@/constants';
import { NETWORK_NAME } from '@/models/network';
import { TokenResponse } from '@/services/adminService';

type PropsBodyTable = {
  data: TokenResponse[];
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
                <RowStatus status={item.status} />
              </div>
            </Td>
            <Td borderBottom={'solid 1px #E4E4E7'}>
              <AddressInfo assetName={item.asset} address={item.fromAddress} />
            </Td>
            <Td borderBottom={'solid 1px #E4E4E7'}>
              <AddressInfo
                assetName={item.asset}
                address={item?.toAddress}
                networkName={NETWORK_NAME.MINA}
              />
            </Td>
            <Td borderBottom={'solid 1px #E4E4E7'}>
              <Text variant={'lg'} color={'text.900'} whiteSpace={'nowrap'}>
                0
              </Text>
            </Td>
            <Td borderBottom={'solid 1px #E4E4E7'}>
              <Text variant={'lg'} color={'text.900'} whiteSpace={'nowrap'}>
                0
              </Text>
            </Td>
            <Td borderBottom={'solid 1px #E4E4E7'}>
              <Text variant={'lg'} color={'text.900'} whiteSpace={'nowrap'}>
                {item?.dailyQuota ? Number(item?.dailyQuota) : ''}
              </Text>
            </Td>
            <Td borderBottom={'solid 1px #E4E4E7'}>
              <Text variant={'lg'} color={'text.900'} whiteSpace={'nowrap'}>
                {item?.bridgeFee ? Number(item.bridgeFee) : ''}
              </Text>
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
