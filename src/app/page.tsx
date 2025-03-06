'use client';
import dynamic from 'next/dynamic';

import { getMinaNetworkId, getMinaProxyUrl } from '@/helpers/common';

const ClientHome = dynamic(() => import('@/components/elements/clientHome'), {
  ssr: false,
});

function Home() {
  console.log(getMinaNetworkId(), getMinaProxyUrl());
  return <ClientHome />;
}

export default Home;
