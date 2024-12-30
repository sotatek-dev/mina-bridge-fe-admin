'use client';
import {
  Heading,
  HeadingProps,
  Modal as ModalChakra,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalFooterProps,
  ModalHeader,
  ModalOverlay,
  ModalProps
} from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';

import { MODAL_NAME } from '@/configs/modal';
import { isFnc } from '@/helpers/common';
import { getUISlice, useAppDispatch, useAppSelector } from '@/store';
import { uiSliceActions } from '@/store/slices/uiSlice';

export type ModalFooterCreateFn = ReactNodeCreateFn<{
  handleCloseModal: () => void;
}>;

export type CustomModalProps = React.PropsWithChildren<{
  modalName: MODAL_NAME;
  onOpen?: () => void;
  onClose?: () => void;
  modalOptions?: Partial<ModalProps>;
  title?: string | React.ReactNode;
  closeButton?: React.ReactNode;
  footerElements?: React.ReactNode | ModalFooterCreateFn;
  footerProps?: ModalFooterProps;
  isLoading?: boolean;
}>;

export type CustomModalTitleProps = React.PropsWithChildren<HeadingProps>;

export function ModalTitle({ children, ...props }: CustomModalTitleProps) {
  return (
    <Heading as={'h3'} variant={'h3'} pt={'4px'} {...props}>
      {children}
    </Heading>
  );
}

export default function CustomModal({
  isLoading,
  modalName,
  onOpen,
  onClose,
  modalOptions,
  ...props
}: CustomModalProps) {
  const dispatch = useAppDispatch();
  const { modals } = useAppSelector(getUISlice);

  const curModal = useMemo(() => modals[modalName], [modals, modalName]);
  const defaultModalProps: Partial<ModalProps> = { scrollBehavior: 'inside' };
  // listen on open
  useEffect(() => {
    if (curModal.isOpen) {
      onOpen && onOpen();
    }
  }, [curModal.isOpen, onOpen]);

  function handleCloseModal() {
    if (isLoading) return;
    onClose && onClose();
    dispatch(uiSliceActions.closeModal({ modalName }));
  }

  return (
    <ModalChakra
      // for instance component to add configuration if needed
      {...(modalOptions ? modalOptions : defaultModalProps)}
      isOpen={curModal.isOpen}
      onClose={handleCloseModal}
    >
      <ModalOverlay bg={'rgba(0, 0, 0, 0.40)'} />
      <ModalContent bg={'text.25'}>
        {props.title && <ModalHeader>{props.title}</ModalHeader>}
        {props.closeButton ? (
          props.closeButton
        ) : (
          <ModalCloseButton
            _focusVisible={{
              boxShadow: 'none',
            }}
          />
        )}
        <ModalBody>{props.children && props.children}</ModalBody>
        {props.footerElements && (
          <ModalFooter {...props.footerProps}>
            {isFnc<ModalFooterCreateFn>(props.footerElements)
              ? props.footerElements({ handleCloseModal })
              : props.footerElements}
          </ModalFooter>
        )}
      </ModalContent>
    </ModalChakra>
  );
}
