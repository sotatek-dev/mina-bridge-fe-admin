'use client';
import { StackProps, Text, VStack } from '@chakra-ui/react';

export default function Section({
  title,
  children,
  ...options
}: React.PropsWithChildren<{ title: string } & StackProps>) {
  const containerProps: StackProps = {
    ...options,
    alignItems: 'flex-start',
  };
  return (
    <VStack {...containerProps}>
      <Text>
        <strong>{title}</strong>
      </Text>
      {children}
    </VStack>
  );
}
