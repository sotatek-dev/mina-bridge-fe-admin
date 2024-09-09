'use client';
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";

import theme from "@/configs/theme";
import ZKContractProvider from "@/providers/zkBridgeInitalize";

const ClientProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ZKContractProvider>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </ZKContractProvider>
    </>
  );
};

export default ClientProviders;
