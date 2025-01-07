'use client';
import { Box, BoxProps, Flex, Text } from '@chakra-ui/react';

import { STATUS } from '@/services/adminService';

const boxStyle: BoxProps = {
  borderRadius: '50%',
  w: '10px',
  h: '10px',
  mr: '10px',
};

type RowStatusProps = {
  status: string;
};

function RowStatus({ status }: RowStatusProps) {
  if (status === STATUS.ENABLE)
    return (
      <Flex align={'center'}>
        <Box {...boxStyle} bg={'primary.purple'} />
        <Text as={'span'}>Success</Text>
      </Flex>
    );
  if (status === STATUS.CREATED)
    return (
      <Flex align={'center'}>
        <Box {...boxStyle} bg={'primary.orange'} />
        <Text as={'span'}>Processing</Text>
      </Flex>
    );
  // if (status === STATUS.CREATED)
  //   return (
  //     <Flex align={'center'}>
  //       <Box {...boxStyle} bg={'red.500'} />
  //       <Text as={'span'}>Failed</Text>
  //     </Flex>
  //   );
}

export default RowStatus;
