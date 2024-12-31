'use client';
import { Box, Button, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import ConfigDeployCommon from './partials/form.config.common';
import ConfigDeployContract from './partials/form.config.contract';

import ROUTES from '@/configs/routes';
import { getWalletSlice, useAppSelector } from '@/store';

export default function DeployContent() {
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
        <Text>Create new asset</Text>
      </HStack>
      <ConfigDeployContract isConnected={isConnected} />
      <ConfigDeployCommon isConnected={isConnected} />

      <VStack w={'full'} alignItems={'flex-end'}>
        <Button
          w={'140px'}
          variant={'primary.orange.solid'}
          //  !isConnected || isLoading || disable
          //  ? 'ghost'
          //  : 'primary.orange.solid'
        >
          Deploy
        </Button>
      </VStack>
    </VStack>
  );
}
