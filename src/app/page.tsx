'use client';

import { VStack } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

// import FormBridge from '@/components/modules/formBridge';
import ROUTES from '@/configs/routes';


export default function Home() {
  return (
    <VStack
      w={'full'}
      pb={{ base: '80px', lg: '110px' }}
      pt={{ base: '0', md: '20px' }}
      gap={'0'}
    >
      <VStack
        maxW={'500px'}
        w={'full'}
        mt={'16px'}
        px={'50px'}
        py={'15px'}
        gap={0}
        bg={'white'}
        borderRadius={'12px'}
        boxShadow={'0px 4px 50px 0px rgba(0, 0, 0, 0.05)'}
      >
        <Link href={ROUTES.PROOF_OF_ASSETS} className={'form-link'}>
          <Text
            as={'span'}
            variant={'md_bold'}
            color={'primary.purple'}
            sx={{
              '.form-link:hover &': {
                textDecor: 'underline',
                color: 'primary.purple.05',
              },
            }}
          >
            View proof of assets
          </Text>
        </Link>
        <Link href={ROUTES.USER_GUIDE} className={'form-link'}>
          <Text
            as={'span'}
            variant={'md_bold'}
            color={'primary.purple'}
            sx={{
              '.form-link:hover &': {
                textDecor: 'underline',
                color: 'primary.purple.05',
              },
            }}
          >
            User guide
          </Text>
        </Link>
      </VStack>
      <Text variant={'md'} color={'text.500'} m={'0'} mt={'16px'}>
        The safe, fast and most secure way to bring cross-chain assets to Mina
        chains
      </Text>
    </VStack>
  );
}
