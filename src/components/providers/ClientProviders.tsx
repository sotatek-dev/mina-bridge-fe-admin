'use client';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';

import theme from '@/configs/theme';

const ClientProviders = ({ children }: { children: React.ReactNode }) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};

export default ClientProviders;
