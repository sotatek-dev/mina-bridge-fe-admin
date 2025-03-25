'use client';
import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import React from 'react';

import useModalCWLogic from './hooks/useModalCWLogic';
import Section from './partials/section';

import LoadingWithText from '@/components/elements/loading/spinner.text';
import { NETWORK_NAME } from '@/models/network';
import { WALLET_NAME } from '@/models/wallet';

type Props = {};

export default function ModalCWContent({}: Props) {
  const { networkOptionsRendered, connectBtnProps } = useModalCWLogic();
  const { status, isAcceptTerm, selectedNetwork, selectedWallet } =
    useModalCWLogic().state;

  const isWalletUsingSnap =
    selectedNetwork === NETWORK_NAME.MINA &&
    selectedWallet === WALLET_NAME.METAMASK;

  return status.isScreenLoading || status.isSnapInstalling ? (
    <LoadingWithText
      id={'modal-cn-wallet-screen-loading'}
      label={'Waiting for confirmation'}
      desc={
        !isWalletUsingSnap
          ? ''
          : status.isSnapInstalling
            ? 'Waiting for Snaps to be installed'
            : 'Snaps was installed, connecting...'
      }
      w={'440px'}
      h={'395px'}
      bgOpacity={0}
    />
  ) : (
    <>
      {/* <Section title="1. Accept">
        <Checkbox
          fontSize="14px"
          isChecked={isAcceptTerm}
          onChange={methods.onToggleAcceptTerm}
        >
          I read and accept{' '}
          <Link href="#" target="_blank" color="primary.purple">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" target="_blank" color="primary.purple">
            Privacy Policy
          </Link>
        </Checkbox>
      </Section> */}
      <Section title={'Choose network'} mt={'20px'}>
        <Flex h={'120px'} w={'100%'} overflowX={'auto'}>
          <HStack>{networkOptionsRendered}</HStack>
        </Flex>
      </Section>

      <Box mt={'20px'}>
        <Button {...connectBtnProps} />
      </Box>
    </>
  );
}
