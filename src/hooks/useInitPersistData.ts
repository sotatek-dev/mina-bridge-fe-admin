'use client';
import { useEffect } from 'react';

import { useAppDispatch } from '@/store';
import { persistSliceActions } from '@/store/slices/persistSlice';

export default function useInitPersistData() {
  const dispatch = useAppDispatch();
  async function initData() {
    const res = dispatch(persistSliceActions.initializeData());
    // check fail
  }
  useEffect(() => {
    initData();
  }, []);
}
