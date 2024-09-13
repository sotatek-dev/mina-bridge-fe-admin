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
      title={<ModalTitle>Connect wallet</ModalTitle>}
      modalOptions={{ size: 'xl', scrollBehavior: 'inside', isCentered: true }}
      isLoading={status.isScreenLoading || status.isSnapInstalling}
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
