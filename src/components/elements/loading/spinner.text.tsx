import { Heading, Text, VStack } from '@chakra-ui/react';

import Spinner from './spinner';

type Props = {
  id: string;
  w?: string;
  h?: string;
  bgOpacity?: number;
  label?: string;
  desc?: string;
  spinnerSize?: number;
};

export default function LoadingWithText({
  id,
  label = '',
  desc = '',
  w = '100vw',
  h = '100vh',
  bgOpacity = 0.1,
  spinnerSize = 140,
}: Props) {
  return (
    <VStack
      w={w}
      h={h}
      alignItems={'center'}
      justifyContent={'center'}
      bg={`rgba(0,0,0,${bgOpacity})`}
      gap={'20px'}
    >
      <Spinner
        id={id}
        w={`${spinnerSize}px`}
        h={`${spinnerSize}px`}
        spinnerSize={spinnerSize}
        bgOpacity={0}
      />
      {label && (
        <Heading as={'h3'} w={'full'} variant={'h3'} color={'black'} textAlign={'center'}>
          {label}
        </Heading>
      )}
      {desc && (
        <Text variant={'md'} color={'text.500'} textAlign={'center'}>
          {desc}
        </Text>
      )}
    </VStack>
  );
}
