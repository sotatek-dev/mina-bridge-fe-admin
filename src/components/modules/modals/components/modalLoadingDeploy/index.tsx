'use client';

import { Box, Button } from '@chakra-ui/react';

import ModalLoadingDeployProvider from './context';
import useModalLoadingDeployLogic from './hooks/useModalLoadingDeployLogic';

import CustomModal from '@/components/elements/customModal';
import LoadingWithText from '@/components/elements/loading/spinner.text';
import { MODAL_NAME } from '@/configs/modal';

function Content() {
  const { closeLoadingDeployModal } = useModalLoadingDeployLogic();
  return (
    <CustomModal
      modalName={MODAL_NAME.LOADING_DEPLOY}
      modalOptions={{
        size: 'xl',
        scrollBehavior: 'inside',
        isCentered: true,
      }}
      closeButton={<></>}
    >
      <LoadingWithText
        id={'modal-cn-wallet-screen-loading'}
        label={'Processing'}
        desc={'Waiting contract to be deployed'}
        w={'full'}
        h={'337px'}
        bgOpacity={0}
      />
      <Box display={'flex'} justifyContent={'center'}>
        <Button
          onClick={closeLoadingDeployModal}
          w={'290px'}
          h={'44px'}
          variant={'primary.orange.solid'}
        >
          Back
        </Button>
      </Box>
    </CustomModal>
  );
}

export default function ModalConnectWallet() {
  return (
    <ModalLoadingDeployProvider modalName={MODAL_NAME.LOADING_DEPLOY}>
      <Content />
    </ModalLoadingDeployProvider>
  );
}
