'use client';
import { Button, Heading, Image, VStack } from '@chakra-ui/react';

import useHeaderLogic from '@/components/layouts/header/useHeaderLogic';
import { getWalletSlice, useAppSelector } from '@/store';

function ClientHome() {
  const { btnConnectWalletProps } = useHeaderLogic();
  const { isConnected } = useAppSelector(getWalletSlice);

  if (isConnected) return <></>;

  return (
    <VStack
      w={'full'}
      pb={{ base: '80px', lg: '110px' }}
      gap={'0'}
      h={{ base: 'calc(100vh - 85px)', lg: 'calc(100vh -115px)' }}
      justifyContent={'center'}
    >
      <Image src={'/assets/logos/logo.mina.text.svg'} />
      <Heading m={'35px 0'} as={'h3'} variant={'h3'} color={'text.900'}>
        Mina Bridge Admin Portal
      </Heading>
      <Button {...btnConnectWalletProps} w={'290px'}>
        Connect Wallet
      </Button>
    </VStack>
  );
}

export default ClientHome;
