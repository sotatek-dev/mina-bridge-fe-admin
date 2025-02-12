'use client';
import { Box, Button, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useDeployState } from './context';
import useDeployLogic from './hooks/useDeployLogic';
import ConfigDeployCommon from './partials/form.config.common';
import ConfigDeployContract from './partials/form.config.contract';

import { useAssetsState } from '@/app/assets/context';
import useAssetLogic from '@/app/assets/hooks/useAssetsLogic';
import { Action } from '@/constants';
import { getWalletSlice, useAppSelector } from '@/store';

export default function DeployContent() {
  const searchParams = useSearchParams();

  const id = searchParams.get('id');
  const { methods } = useAssetsState();
  const { isConnected } = useAppSelector(getWalletSlice);
  const router = useRouter();
  const { fetchedValue, isLoading } = useDeployState().state;
  const { getListAssets } = useAssetLogic();
  const { action, handleReDeploy, handleDeploy, isDisabled } = useDeployLogic();

  const isBtnNotActive = id
    ? !isConnected || isLoading
    : !isConnected || isLoading || isDisabled;

  const handleDeployBtn = async () => {
    if (id) await handleReDeploy(Number(id));
    else await handleDeploy();
    methods.updateSearch('');
    methods.updateCurrentPage(1);
    getListAssets('', 1);
  };

  return (
    <VStack w={'full'} mb={10} gap={5} alignItems={'flex-start'}>
      <HStack
        mt={10}
        gap={5}
        fontSize={'40px'}
        fontWeight={'600'}
        color={'text.900'}
      >
        <Box cursor={'pointer'} onClick={() => router.back()}>
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
          variant={isBtnNotActive ? 'ghost' : 'primary.orange.solid'}
          isLoading={isLoading}
          isDisabled={isBtnNotActive}
          onClick={handleDeployBtn}
          _hover={{
            background: isBtnNotActive ? 'ghost' : 'primary.orange.solid',
            opacity: 0.8,
            border: 'none',
          }}
        >
          {id ? 'Re Deploy' : 'Deploy'}
        </Button>
      </VStack>
    </VStack>
  );
}
