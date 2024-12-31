'use client';
import {
  Grid,
  GridItem,
  HStack,
  Input,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

type ConfigContractProps = {
  isConnected: boolean;
};

export default function ConfigDeployContract({
  isConnected,
}: ConfigContractProps) {
  const isLoading = false;
  const addressInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (addressInputRef) {
      addressInputRef?.current?.focus();
    }
  }, [addressInputRef]);

  return (
    <HStack w={'full'}>
      <Grid
        bg={'text.25'}
        w={'full'}
        gridTemplateColumns={'repeat(2, 1fr)'}
        px={9}
        py={8}
        gridRowGap={4}
        gridColumnGap={8}
      >
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <GridItem key={index}>
              <Skeleton h={'22.4px'} w={'100%'} mb={1} />
              <Skeleton h={'44px'} w={'100%'} />
            </GridItem>
          ))
        ) : (
          <>
            <GridItem>
              <Text variant={'lg_medium'} color={'text.700'} mb={1}>
                Asset address on Ethereum
              </Text>
              <Input
                placeholder={'Please fill in contract address on Ethereum'}
                min={0}
                maxLength={79}
                ref={addressInputRef}
              />
            </GridItem>
            <GridItem>
              <Text variant={'lg_medium'} color={'text.700'} mb={1}>
                Asset name
              </Text>
              <Input placeholder={'Asset name'} min={0} maxLength={79} />
            </GridItem>
            <GridItem>
              <Text variant={'lg_medium'} color={'text.700'} mb={1}>
                Minimum Tokens to bridge
              </Text>
              <Input placeholder={'0'} type={'number'} min={0} maxLength={79} />
            </GridItem>
            <GridItem>
              <Text variant={'lg_medium'} color={'text.700'} mb={1}>
                Maximum Tokens to bridge
              </Text>
              <Input placeholder={'0'} type={'number'} min={0} maxLength={79} />
            </GridItem>
          </>
        )}
      </Grid>
    </HStack>
  );
}
