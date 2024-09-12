'use client';
import { Box, Button, Heading, Image, Text } from '@chakra-ui/react';
import { useMemo } from 'react';

import CustomModal from '@/components/elements/customModal';
import { MODAL_NAME } from '@/configs/modal';
import WALLETS from '@/models/wallet';
import { getUISlice, useAppSelector } from '@/store';
import { ModalCWErrorPayload } from '@/store/slices/uiSlice';

export type ModalConnectWalletProps = {};

export default function ModalConnectWalletError({}: ModalConnectWalletProps) {
  const { modals } = useAppSelector(getUISlice);

  const modalPayload = useMemo(
    () =>
      modals[MODAL_NAME.CONNECT_WALLET_ERROR]
        .payload as Maybe<ModalCWErrorPayload>,
    [modals]
  );

  const walletInstance = useMemo(
    () => modalPayload && WALLETS[modalPayload.walletName],
    [modalPayload]
  );

  return (
    <CustomModal
      modalName={MODAL_NAME.CONNECT_WALLET_ERROR}
      modalOptions={{
        size: 'md',
        scrollBehavior: 'inside',
        isCentered: true,
      }}
    >
      <Box
        margin={'30px'}
        display={'flex'}
        alignItems={'center'}
        flexDirection={'column'}
      >
        <Image
          mb={'20px'}
          width={'80px'}
          src={'/assets/icons/icon.error.circle.svg'}
        />
        <Heading as={'h3'} variant={'h3'}>
          Ooops!
        </Heading>
        <Text
          textAlign={'center'}
          m={'5px 23px 25px'}
          fontSize={'14px'}
          fontWeight={'400'}
        >
          Looks like you don&apos;t have the {` `}
          <span style={{ textTransform: 'capitalize' }}>
            {walletInstance?.name || ''}
          </span>{' '}
          {` `}
          Wallet installed yet. Head over to the Chrome Extension to quickly
          install the extension.
        </Text>
        {walletInstance ? (
          <Button
            onClick={() =>
              window.open(walletInstance.metadata.installationURL.pc, '_blank')
            }
            variant={'primary.orange.solid'}
          >
            Install Extension
          </Button>
        ) : null}
      </Box>
    </CustomModal>
  );
}
