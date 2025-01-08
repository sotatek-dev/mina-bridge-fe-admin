'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import ROUTES from '@/configs/routes';

export default function Configuration() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTES.HOME);
  }, []);

  return <div />;
}

// import dynamic from 'next/dynamic';

// import Loading from '@/components/elements/loading/spinner.text';
// import { getUISlice, useAppSelector } from '@/store';

// const ConfigProvider = dynamic(() => import('./context'), {
//   ssr: false,
// });

// const ConfigurationContent = dynamic(() => import('./content'), {
//   ssr: false,
// });

// export default function Configuration() {
//   const { isLoading } = useAppSelector(getUISlice);

//   return (
//     <ConfigProvider>
//       {isLoading ? (
//         <Loading
//           id={'main_screen_loading'}
//           w={'full'}
//           h={'395px'}
//           bgOpacity={0}
//           label={'Waiting to compile contract!'}
//         />
//       ) : (
//         <ConfigurationContent />
//       )}
//     </ConfigProvider>
//   );
// }
