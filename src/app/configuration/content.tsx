'use client';
import { Heading, VStack } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

import { getWalletSlice, useAppSelector } from '@/store';

const ConfigCommon = dynamic(() => import('./partials/form.config.common'), {
  ssr: false,
});

const ConfigContract = dynamic(
  () => import('./partials/form.config.contract'),
  {
    ssr: false,
  }
);

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
