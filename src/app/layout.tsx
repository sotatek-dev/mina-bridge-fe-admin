import type { Metadata } from 'next';

import WrapperLayout from '@/components/layouts/wrapper-layout';
import ClientProviders from '@/components/providers/ClientProviders';
import ReduxProvider from '@/components/providers/ReduxProvider';

export const metadata: Metadata = {
  title: 'Mina Bridge',
  description: 'Mina Bridge',
  icons: '/assets/logos/logo.mina.circle.svg',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={'en'}>
      <body>
        <ReduxProvider>
          <ClientProviders>
            <WrapperLayout>{children}</WrapperLayout>
          </ClientProviders>
        </ReduxProvider>
      </body>
    </html>
  );
}
