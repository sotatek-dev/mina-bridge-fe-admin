import { Link } from '@chakra-ui/next-js';
import { Button, Flex, HStack, Image, Text } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { PropsWithChildren, useRef } from 'react';

import useHeaderLogic from './useHeaderLogic';

import Logo from '@/components/elements/logo';
import ROUTES from '@/configs/routes';
import { getEnvNetwork } from '@/constants';
import { useOutsideCheck } from '@/hooks/useOutsideCheck';
import { getWalletSlice, useAppSelector } from '@/store';

type Props = PropsWithChildren<{}>;

export default function Header({}: Props) {
  const { isConnected } = useAppSelector(getWalletSlice);
  const disconnectBtnRef = useRef<any>(null);
  const {
    disconnectWallet,
    btnConnectWalletProps,
    btnSelectNetworkProps,
    closeMenu,
  } = useHeaderLogic();

  useOutsideCheck(disconnectBtnRef, closeMenu);
  const pathname = usePathname();

  return (
    <Flex
      w={'full'}
      maxH={75}
      p={{
        base: 10,
        lg: '18px 100px',
        xl: '18px 150px',
      }}
      bg={'white'}
    >
      <HStack justifyContent={'center'} gap={1}>
        <Link href={ROUTES.HOME}>
          <Logo />
        </Link>
      </HStack>
      <HStack ml={'auto'}>
        {isConnected && (
          <>
            <Link href={ROUTES.HISTORY} mr={'32px'}>
              <Text
                variant={'lg_semiBold'}
                color={
                  pathname === ROUTES.HISTORY ? 'primary.purple' : 'text.700'
                }
              >
                History
              </Text>
            </Link>
            <Link href={ROUTES.CONFIGURATION} mr={'32px'}>
              <Text
                variant={'lg_semiBold'}
                color={
                  pathname === ROUTES.CONFIGURATION
                    ? 'primary.purple'
                    : 'text.700'
                }
              >
                Configuration
              </Text>
            </Link>
          </>
        )}
        <Button {...btnSelectNetworkProps} />

        <Button {...btnConnectWalletProps} />

        {isConnected && (
          <Button w={10} p={'10px'} onClick={disconnectWallet}>
            <Image width={'22px'} src={'/assets/icons/icon.log-out.svg'} />
          </Button>
        )}
        <HStack gap={1} ml={3}>
          <Image width={'22px'} src={'/assets/icons/icon.env.network.svg'} />
          <Text color={'text.500'}>
            {getEnvNetwork(process.env.NEXT_PUBLIC_ENV!)}
          </Text>
        </HStack>
      </HStack>
    </Flex>
  );
}
