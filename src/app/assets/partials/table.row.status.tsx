'use client';
import { Box, BoxProps, Flex, Text } from '@chakra-ui/react';

const boxStyle: BoxProps = {
  borderRadius: '50%',
  w: '10px',
  h: '10px',
  mr: '10px',
};

export const STATUS = {
  WAITING: 'waiting',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAIL: 'failed',
};

type RowStatusProps = {
  status: string;
  networkName: string;
};

function RowStatus({ status, networkName }: RowStatusProps) {
  if (status === STATUS.COMPLETED)
    return (
      <Flex align={'center'}>
        <Box {...boxStyle} bg={'primary.purple'} />
        <Text as={'span'}>Success</Text>
      </Flex>
    );
  if (status === STATUS.WAITING)
    return (
      <Flex align={'center'}>
        <Box>
          <Box {...boxStyle} bg={'yellow.500'} />
        </Box>
        <Text as={'span'}>
          {networkName === 'eth' ? 'ETH Locked' : 'WETH burned'}
        </Text>
      </Flex>
    );
  if (status === STATUS.PROCESSING)
    return (
      <Flex align={'center'}>
        <Box>
          <Box {...boxStyle} bg={'yellow.500'} />
        </Box>
        <Text as={'span'}>
          {networkName === 'eth'
            ? 'Minting WETH in Mina network'
            : 'Unlock ETH in Ethereum'}
        </Text>
      </Flex>
    );
  if (status === STATUS.FAIL)
    return (
      <Flex align={'center'}>
        <Box {...boxStyle} bg={'red.500'} />
        <Text as={'span'}>Failed</Text>
      </Flex>
    );
}

export default RowStatus;
