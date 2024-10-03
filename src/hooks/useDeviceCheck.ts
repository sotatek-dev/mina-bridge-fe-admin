'use client';
import { useEffect } from 'react';

import { useAppDispatch } from '@/store';
import { persistSliceActions } from '@/store/slices/persistSlice';

export default function useDeviceCheck() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(persistSliceActions.deviceCheck());
  }, []);
}
