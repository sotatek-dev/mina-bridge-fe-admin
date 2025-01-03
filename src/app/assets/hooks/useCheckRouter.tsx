import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import ROUTES from '@/configs/routes';
import { Action } from '@/constants';
import { getWalletSlice, useAppSelector } from '@/store';

const useCheckRouter = () => {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  const { isConnected } = useAppSelector(getWalletSlice);

  const action = useMemo(() => {
    return params.get('action');
  }, [params]);

  useEffect(() => {
    if (
      isConnected &&
      pathname === ROUTES.ASSETS &&
      action !== Action.CREATE &&
      action !== Action.DETAIL
    ) {
      router.replace(ROUTES.ASSETS);
    }
  }, [isConnected, pathname, action]);

  return { action };
};

export default useCheckRouter;
