'use client';
import useModalSALogic from './hooks/useModalSALogic';

import CustomModal from '@/components/elements/customModal';
import { MODAL_NAME } from '@/configs/modal';

export default function ModalSuccessAction() {
  const { renderContentModal } = useModalSALogic();

  return (
    <CustomModal
      modalName={MODAL_NAME.SUCCESS_ACTION}
      modalOptions={{
        size: 'md',
        scrollBehavior: 'inside',
        isCentered: true,
      }}
    >
      {renderContentModal}
    </CustomModal>
  );
}
