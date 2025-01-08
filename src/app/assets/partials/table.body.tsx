'use client';

import { Box, Tbody, Td, Text, Tr } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import AddressInfo from './table.row.infoTx';
import RowStatus from './table.row.status';
import RowSwitch from './table.row.switch';

import useModalLoadingDeployLogic from '@/components/modules/modals/components/modalLoadingDeploy/hooks/useModalLoadingDeployLogic';
import { Action } from '@/constants';
import { nFormatter } from '@/helpers/common';
import { NETWORK_NAME } from '@/models/network';
import { STATUS, TokenResponse } from '@/services/adminService';

type PropsBodyTable = {
  data: TokenResponse[];
};

function BodyTable({ data }: PropsBodyTable) {
  const router = useRouter();
  const { openLoadingDeployModal } = useModalLoadingDeployLogic();

  const handleRow = (data: TokenResponse) => {
    if (data.status === STATUS.ENABLE || data.status === STATUS.DISABLE) {
      router.push(`?action=${Action.DETAIL}&&address=${data.fromAddress}`);
      return;
    }
    if (data.status === STATUS.DEPLOY_FAILED) {
      router.push(`?action=${Action.RE_DEPLOY}&&address=${data.fromAddress}`);
    }
  };
  return (
    <Tbody>
      {data.map((item) => {
        return (
          <Tr key={item.id} cursor={'pointer'} onClick={() => handleRow(item)}>
            <Td borderBottom={'solid 1px #E4E4E7'}>
              <div>
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
                {/* {`${truncatedNumber(
                  item.tip ? item.tip : '0.00'
                )} ${!item?.tip || _.isEmpty(item.tokenFromName) ? '' : item.tokenFromName}`} */}
                0
              </Text>
            </Td>
            <Td borderBottom={'solid 1px #E4E4E7'}>
              <Text variant={'lg'} color={'text.900'} whiteSpace={'nowrap'}>
                {/* {`${truncatedNumber(
                  item.tip ? item.tip : '0.00'
                )} ${!item?.tip || _.isEmpty(item.tokenFromName) ? '' : item.tokenFromName}`} */}
                0
              </Text>
            </Td>
            <Td borderBottom={'solid 1px #E4E4E7'}>
              <Text variant={'lg'} color={'text.900'} whiteSpace={'nowrap'}>
                {item?.dailyQuota ? nFormatter(item?.dailyQuota) : ''}
              </Text>
            </Td>
            <Td borderBottom={'solid 1px #E4E4E7'}>
              <Text variant={'lg'} color={'text.900'} whiteSpace={'nowrap'}>
                {item?.bridgeFee ? Number(item.bridgeFee) : ''}
              </Text>
            </Td>
            <Td borderBottom={'solid 1px #E4E4E7'}>
              <Box onClick={(e) => e.stopPropagation()} w={'fit-content'}>
                <RowSwitch
                  id={item.id}
                  isHidden={item.isHidden}
                  status={item.status}
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
