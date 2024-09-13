'use client';
import dynamic from 'next/dynamic';

const ClientHome = dynamic(() => import('@/components/elements/clientHome'), {
  ssr: false,
});

function Home() {
  return <ClientHome />;
}

export default Home;
