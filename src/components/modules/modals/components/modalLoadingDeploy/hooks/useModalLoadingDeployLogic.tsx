'use client';

import { ButtonProps } from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';

import { MODAL_NAME } from '@/configs/modal';
import { useAppDispatch } from '@/store';
import { uiSliceActions } from '@/store/slices/uiSlice';

export default function useModalLoadingDeployLogic() {
  const dispatch = useAppDispatch();

  const openLoadingDeployModal = useCallback(() => {
    dispatch(
      uiSliceActions.openModal({ modalName: MODAL_NAME.LOADING_DEPLOY })
    );
  }, [dispatch]);

  const closeLoadingDeployModal = useCallback(() => {
    dispatch(
      uiSliceActions.closeModal({ modalName: MODAL_NAME.LOADING_DEPLOY })
    );
  }, [dispatch]);

  const modalLoadingDeployProps = useMemo<ButtonProps>(() => {
    return {
      variant: 'primary.orange.solid',
      onClick: openLoadingDeployModal,
    };
  }, [openLoadingDeployModal]);

  return {
    modalLoadingDeployProps,
    openLoadingDeployModal,
    closeLoadingDeployModal,
  };
}
