'use client';
import { Box, Button, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useDeployState } from './context';
import useDeployLogic from './hooks/useDeployLogic';
import ConfigDeployCommon from './partials/form.config.common';
import ConfigDeployContract from './partials/form.config.contract';

import ROUTES from '@/configs/routes';
import { Action } from '@/constants';
import { getWalletSlice, useAppSelector } from '@/store';

export default function DeployContent() {
  const searchParams = useSearchParams();

  const id = searchParams.get('id');

  const { isConnected } = useAppSelector(getWalletSlice);
  const router = useRouter();
  const { fetchedValue, isLoading } = useDeployState().state;

  const { action, handleReDeploy } = useDeployLogic();

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
        <Text>
          {action === Action.CREATE
            ? 'Create new asset'
            : fetchedValue.assetName}
        </Text>
      </HStack>
      <ConfigDeployContract isConnected={isConnected} />
      <ConfigDeployCommon isConnected={isConnected} />

      <VStack w={'full'} alignItems={'flex-end'}>
        <Button
          w={'140px'}
          variant={!isConnected || isLoading ? 'ghost' : 'primary.orange.solid'}
          isLoading={isLoading}
          isDisabled={!isConnected || isLoading}
          onClick={() => handleReDeploy(Number(id))}
          _hover={{
            background:
              !isConnected || isLoading ? 'ghost' : 'primary.orange.solid',
            opacity: 0.8,
            border: 'none',
          }}
        >
          Re Deploy
        </Button>
      </VStack>
    </VStack>
  );
}
