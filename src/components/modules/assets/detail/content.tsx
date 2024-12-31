'use client';
import { Box, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import ConfigDetailCommon from './partials/form.config.common';
import ConfigDetailContract from './partials/form.config.contract';

import ROUTES from '@/configs/routes';
import { getWalletSlice, useAppSelector } from '@/store';

export default function DetailContent() {
  const { isConnected } = useAppSelector(getWalletSlice);
  const router = useRouter();

  return (
    <VStack w={'full'} mb={10} gap={5} alignItems={'flex-start'}>
      <HStack
        mt={10}
        gap={5}
        fontSize={'40px'}
        fontWeight={'600'}
        color={'text.900'}
      >
        <Box cursor={'pointer'} onClick={() => router.replace(ROUTES.ASSETS)}>
          <Image src={'/assets/icons/icon.arrow.left.svg'} />
        </Box>
        <Text>Update asset</Text>
      </HStack>
      <ConfigDetailContract isConnected={isConnected} />
      <ConfigDetailCommon isConnected={isConnected} />
    </VStack>
  );
}
