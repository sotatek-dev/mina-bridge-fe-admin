'use client';

import { useToast } from '@chakra-ui/react';
import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

import { getUISlice, useAppDispatch, useAppSelector } from '@/store';
import {
  DisableNotificationPayload,
  ToastController,
  ToastType,
  UIState,
  initialToastState,
  uiSliceActions,
} from '@/store/slices/uiSlice';

type Props = {};

export default function NotiReporter({}: Props) {
  const dispatch = useAppDispatch();
  const toastHandler = useToast();
  const { toast } = useAppSelector(getUISlice);
  const [servedToast, setServedToast] =
    useState<UIState['toast']>(initialToastState);

  const loadServedToast = useCallback(() => {
    let newToasts = JSON.parse(JSON.stringify(initialToastState));
    Object.entries(toast).forEach(([category, items]) => {
      const cate = category as ToastType;
      (items || []).forEach((item) => {
        if (item.isDisplay) {
          newToasts[cate].push(item);
        }
      });
    });
    setServedToast(newToasts);
  }, [toast, setServedToast]);

  const displayToast = useCallback(
    (category: ToastType, toasts: ToastController[]) => {
      toasts.forEach(({ id, isDisplay, ...options }) => {
        toastHandler({ ...options, id: `${category}_${id}`, status: category });
      });
    },
    [toastHandler]
  );

  useEffect(() => {
    loadServedToast();
  }, [toast]);

  useEffect(() => {
    if (isEqual(servedToast, initialToastState)) return;

    let disableToast: DisableNotificationPayload = {
      warning: [],
      error: [],
      info: [],
      success: [],
    };
    Object.entries(servedToast).forEach(([cate, items]) => {
      displayToast(cate as ToastType, items);
      disableToast[cate as ToastType] = items.map((e) => e.id);
    });
    dispatch(uiSliceActions.disableNotification(disableToast));
  }, [servedToast]);

  return <></>;
}
