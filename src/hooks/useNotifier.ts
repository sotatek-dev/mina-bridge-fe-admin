'use client';
import { useToast } from '@chakra-ui/react';

import { getUISlice, useAppDispatch, useAppSelector } from '@/store';
import { SendNotificationPayload, uiSliceActions } from '@/store/slices/uiSlice';

export default function useNotifier() {
  const { toast } = useAppSelector(getUISlice);
  const dispatch = useAppDispatch();
  const toastController = useToast();

  function checkNotifyActive(id: string) {
    return toastController.isActive(id);
  }

  function sendNotification(payload: SendNotificationPayload): string {
    const category = toast[payload.toastType];
    const prevToastId =
      category.length > 0 ? category[category.length - 1].id : 0;
    dispatch(uiSliceActions.sendNotification(payload));

    return `${payload.toastType}_${prevToastId + 1}`;
  }
  return { sendNotification, checkNotifyActive };
}
