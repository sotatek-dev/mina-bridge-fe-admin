'use client';
import React, { useCallback, useMemo } from 'react';

import { MODAL_NAME } from '@/configs/modal';
import { getUISlice, useAppDispatch, useAppSelector } from '@/store';
import { uiSliceActions } from '@/store/slices/uiSlice';

export type ModalLoadingDeployCtxValueType = {
  methods: {
    onOpenLoadingDeployModal: () => void;
    onCloseLoadingDeployModal: () => void;
  };
};

export const ModalLoadingDeployContext =
  React.createContext<ModalLoadingDeployCtxValueType | null>(null);

export function useModalLoadingDeployState() {
  return React.useContext(
    ModalLoadingDeployContext
  ) as ModalLoadingDeployCtxValueType;
}

export type ModalLoadingDeployContextProps = React.PropsWithChildren<{
  modalName: MODAL_NAME;
}>;

export default function ModalLoadingDeployProvider({
  children,
  modalName,
}: ModalLoadingDeployContextProps) {
  const dispatch = useAppDispatch();
  const { modals } = useAppSelector(getUISlice);

  const curModal = useMemo(() => modals[modalName], [modals, modalName]);

  const onOpenLoadingDeployModal = useCallback(() => {
    dispatch(
      uiSliceActions.openModal({
        modalName: MODAL_NAME.LOADING_DEPLOY,
        payload: { titleLoading: 'Processing' },
      })
    );
  }, [dispatch]);

  const onCloseLoadingDeployModal = useCallback(() => {
    dispatch(
      uiSliceActions.closeModal({ modalName: MODAL_NAME.LOADING_DEPLOY })
    );
  }, [dispatch]);

  const value = useMemo<ModalLoadingDeployCtxValueType>(
    () => ({
      methods: {
        onOpenLoadingDeployModal,
        onCloseLoadingDeployModal,
      },
    }),
    [onOpenLoadingDeployModal, onCloseLoadingDeployModal, curModal, modalName]
  );

  return (
    <ModalLoadingDeployContext.Provider value={value}>
      {children}
    </ModalLoadingDeployContext.Provider>
  );
}
