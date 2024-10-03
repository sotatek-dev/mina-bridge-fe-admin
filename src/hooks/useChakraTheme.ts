'use client';
import { useColorMode } from '@chakra-ui/react';
import { useEffect } from 'react';

export default function useChakraTheme() {
  const { colorMode, setColorMode } = useColorMode();
  useEffect(() => {
    // persist light mode
    if (colorMode === 'dark') setColorMode('light');
  }, [colorMode]);
}
