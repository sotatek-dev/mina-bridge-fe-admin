'use client';
import { Heading, VStack } from '@chakra-ui/react';

import ConfigCommon from './partials/form.config.common';
import ConfigContract from './partials/form.config.contract';

import { getWalletSlice, useAppSelector } from '@/store';

export default function ConfigurationContent() {
  const { isConnected } = useAppSelector(getWalletSlice);
  return (
    <VStack w={'full'} alignItems={'flex-start'}>
      <Heading as={'h1'} variant={'h1'} color={'text.900'} mb={'30px'}>
        Assets
      </Heading>
      <ConfigContract isConnected={isConnected} />
      <Heading as={'h1'} variant={'h1'} color={'text.900'} mb={'30px'}>
        Common Configuration
      </Heading>
      <ConfigCommon isConnected={isConnected} />
    </VStack>
  );
}
