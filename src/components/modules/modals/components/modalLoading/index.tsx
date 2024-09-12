'use client';
import CustomModal from '@/components/elements/customModal';
import LoadingWithText from '@/components/elements/loading/spinner.text';
import { MODAL_NAME } from '@/configs/modal';
import { getUISlice, useAppSelector } from '@/store';
import { ModalLoadingPayload } from '@/store/slices/uiSlice';

export default function ModalLoading() {
  const { modals } = useAppSelector(getUISlice);
  const payload = modals.loading.payload as ModalLoadingPayload;

  return (
    <CustomModal
      modalName={MODAL_NAME.LOADING}
      modalOptions={{
        size: 'md',
        scrollBehavior: 'inside',
        isCentered: true,
      }}
    >
      <LoadingWithText
        id={'modal_loading_screen'}
        label={payload?.titleLoading}
        w={'full'}
        h={'337px'}
        bgOpacity={0}
      />
    </CustomModal>
  );
}
