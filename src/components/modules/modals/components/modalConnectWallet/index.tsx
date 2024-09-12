'use client';
import ModalCWContent from './content';
import ModalCWProvider from './context';
import useModalCWLogic from './hooks/useModalCWLogic';

import CustomModal, { ModalTitle } from '@/components/elements/customModal';
import { MODAL_NAME } from '@/configs/modal';

export type ModalConnectWalletProps = {};

function Content() {
  const { status } = useModalCWLogic().state;

  return (
    <CustomModal
      modalName={MODAL_NAME.CONNECT_WALLET}
      title={
        status.isScreenLoading || status.isSnapInstalling ? (
          <></>
        ) : (
          <ModalTitle>Connect wallet</ModalTitle>
        )
      }
      modalOptions={{ size: 'xl', scrollBehavior: 'inside', isCentered: true }}
      isLoading={status.isScreenLoading || status.isSnapInstalling}
      closeButton={
        status.isScreenLoading || status.isSnapInstalling ? <></> : undefined
      }
    >
      <ModalCWContent />
    </CustomModal>
  );
}

export default function ModalConnectWallet({}: ModalConnectWalletProps) {
  return (
    <ModalCWProvider modalName={MODAL_NAME.CONNECT_WALLET}>
      <Content />
    </ModalCWProvider>
  );
}
