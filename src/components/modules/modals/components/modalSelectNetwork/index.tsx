'use client';
import ModalSNProvider, { useModalSNState } from './context';
import CardContainer from './partials/card.container';

import CustomModal, { ModalTitle } from '@/components/elements/customModal';
import { MODAL_NAME } from '@/configs/modal';

function Content() {
  const { modalName } = useModalSNState().constants;
  return (
    <CustomModal
      modalName={modalName}
      title={<ModalTitle>Select a network</ModalTitle>}
      modalOptions={{ size: 'lg', scrollBehavior: 'inside', isCentered: true }}
    >
      <CardContainer />
    </CustomModal>
  );
}
export default function ModalSelectNetwork() {
  return (
    <ModalSNProvider modalName={MODAL_NAME.SELECT_NETWORK}>
      <Content />
    </ModalSNProvider>
  );
}
