'use client';
import { Box, Text } from '@chakra-ui/react';
import _ from 'lodash';

import { truncateMid } from '@/helpers/common';
import useNotifier from '@/hooks/useNotifier';
import { NETWORK_NAME } from '@/models/network';

type InfoTransactionProps = {
  assetName: string;
  address: string;
  networkName?: NETWORK_NAME;
};

function InfoTransaction({
  assetName,
  address,
  networkName,
}: InfoTransactionProps) {
  const { sendNotification } = useNotifier();
  const [fSlice, sSlice] = !address ? ['', ''] : truncateMid(address, 4, 4);

  function copyToClipboard(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    navigator.clipboard
      .writeText(address)
      .then(() => {
        sendNotification({
          toastType: 'success',
          options: {
            title: 'Copied to clipboard',
          },
        });
      })
      .catch((err) => {
        sendNotification({
          toastType: 'success',
          options: {
            title: 'Copied failed',
          },
        });
      });
  }

  return (
    <>
      {address && (
        <>
          <Text variant={'lg'} color={'text.900'}>
            {networkName === NETWORK_NAME.MINA && 'W'}
            {assetName}
          </Text>
          <Box cursor={'pointer'} onClick={copyToClipboard}>
            <Text variant={'md'} color={'primary.purple'} whiteSpace={'nowrap'}>
              {`${fSlice}...${sSlice}`} ({assetName})
            </Text>
          </Box>
        </>
      )}
    </>
  );
}

export default InfoTransaction;
