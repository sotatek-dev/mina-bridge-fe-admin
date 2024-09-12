'use client';
import { Button, Heading, Image, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import useHeaderLogic from '@/components/layouts/header/useHeaderLogic';
import ROUTES from '@/configs/routes';
import { getWalletSlice, useAppSelector } from '@/store';

function Home() {
  const router = useRouter();
  const { isConnected } = useAppSelector(getWalletSlice);
  const { btnConnectWalletProps } = useHeaderLogic();

  if (isConnected) {
    router.push(ROUTES.HISTORY);
    return null;
  }

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
      {!isConnected && (
        <Button {...btnConnectWalletProps} w={'290px'}>
          Connect Wallet
        </Button>
      )}
    </VStack>
  );
}

export default Home;
