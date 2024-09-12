'use client';
import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';

import { MODAL_NAME } from '@/configs/modal';
import { getUISlice, useAppDispatch, useAppSelector } from '@/store';
import { uiSliceActions } from '@/store/slices/uiSlice';

export default function useModalSALogic() {
  const { modals } = useAppSelector(getUISlice);
  const dispatch = useAppDispatch();

  const boxContentProps = useMemo<BoxProps>(() => {
    return {
      margin: '30px',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
    };
  }, []);

  const handleCloseModal = useCallback(() => {
    dispatch(
      uiSliceActions.closeModal({ modalName: MODAL_NAME.SUCCESS_ACTION })
    );
  }, [dispatch]);

  const buttonCloseProps = useMemo<ButtonProps>(() => {
    return {
      mt: '25px',
      variant: 'primary.orange.solid',
      h: '44px',
      w: '290px',
      onClick: handleCloseModal,
    };
  }, [handleCloseModal]);

  const renderContentModal = useMemo(() => {
    const payload = modals?.success_action.payload;
    if (!payload) return <></>;
    if ('title' in payload)
      return (
        <Box {...boxContentProps}>
          <Image src={'/assets/logos/logo.success.svg'} />
          <Heading as={'h3'} variant={'h3'} mt={'20px'} textAlign={'center'}>
            {payload?.title}
          </Heading>
          {payload?.message && <Text>{payload?.message}</Text>}
          {payload?.isCloseBtn && (
            <Button {...buttonCloseProps}>Dismiss</Button>
          )}
        </Box>
      );
  }, [boxContentProps, buttonCloseProps, modals?.success_action.payload]);
  return {
    boxContentProps,
    renderContentModal,
  };
}
