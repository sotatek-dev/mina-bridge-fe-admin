'use client';
import { Box, Center, Container, VStack } from '@chakra-ui/react';
import { redirect, usePathname } from 'next/navigation';
import { PropsWithChildren, useEffect, useState } from 'react';

import UnmatchedChain from '../banners/unmatchedChain';
import Header from '../header';

import Loading from '@/components/elements/loading/spinner';
import Modals from '@/components/modules/modals';
import NotiReporter from '@/components/modules/notiReporter';
import ROUTES, { PROTECTED_ROUTES } from '@/configs/routes';
import useChakraTheme from '@/hooks/useChakraTheme';
import useDeviceCheck from '@/hooks/useDeviceCheck';
import useInitPersistData from '@/hooks/useInitPersistData';
import useLoadWalletInstances from '@/hooks/useLoadWalletInstances';
import useWalletEvents from '@/hooks/useWalletEvents';
import useWeb3Injected from '@/hooks/useWeb3Injected';
import { getWalletSlice, useAppSelector } from '@/store';

type Props = PropsWithChildren<{}>;

function WrapperLayout({ children }: Props) {
  useWeb3Injected();
  useLoadWalletInstances();
  useInitPersistData();
  useChakraTheme();
  useWalletEvents();
  useDeviceCheck();

  const pathname = usePathname();
  const isNotHistoryScreen = pathname !== ROUTES.HISTORY;
  const isNotConfigurationScreen = pathname !== ROUTES.CONFIGURATION;
  const isNotHomeScreen = pathname !== ROUTES.HOME;
  const { isConnected } = useAppSelector(getWalletSlice);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isConnected && PROTECTED_ROUTES.includes(pathname as ROUTES))
      redirect(ROUTES.HOME);
  }, [isConnected, pathname]);

  return (
    <div id={'wrapper-layout'}>
      {!isClient ? (
        <Loading id={'loading'} />
      ) : (
        <VStack maxH={'100vh'} minH={'100vh'} h={'100vh'}>
          {isNotHomeScreen && <Header />}
          <Box
            as={'section'}
            w={'full'}
            h={'full'}
            bgColor={'text.100'}
            bgImage={
              isNotHistoryScreen && isNotConfigurationScreen
                ? 'url("/assets/images/image.main-bg.jpg")'
                : ''
            }
            bgSize={'cover'}
            bgPosition={'left top'}
            bgRepeat={'no-repeat'}
            bgAttachment={'fixed'}
            overflow={'auto'}
          >
            {isConnected && <UnmatchedChain />}
            <Container
              maxW={{
                sm: 'container.sm',
                md: 'container.md',
                lg: 'container.lg',
                xl: 'container.xl',
              }}
            >
              <Center w={'full'}>{children}</Center>
            </Container>
          </Box>
        </VStack>
      )}
      <Modals />
      <NotiReporter />
    </div>
  );
}

export default WrapperLayout;
