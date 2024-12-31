'use client';
import {
  Button,
  Grid,
  GridItem,
  Input,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

type ConfigContractProps = {
  isConnected: boolean;
};

export default function ConfigDetailContract({
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
    <VStack w={'full'}>
      <Grid bg={'text.25'} w={'full'} px={9} py={8} gridRowGap={4}>
        {isLoading ? (
          <>
            <Grid gridTemplateColumns={'repeat(3, 1fr)'} gridColumnGap={8}>
              {Array.from({ length: 3 }).map((_, index) => (
                <GridItem key={index}>
                  <Skeleton h={'22.4px'} w={'100%'} mb={1} />
                  <Skeleton h={'44px'} w={'100%'} />
                </GridItem>
              ))}
            </Grid>
            <Grid gridTemplateColumns={'repeat(2, 1fr)'} gridColumnGap={8}>
              {Array.from({ length: 2 }).map((_, index) => (
                <GridItem key={index}>
                  <Skeleton h={'22.4px'} w={'100%'} mb={1} />
                  <Skeleton h={'44px'} w={'100%'} />
                </GridItem>
              ))}
            </Grid>
          </>
        ) : (
          <>
            <Grid gridTemplateColumns={'repeat(3, 1fr)'} gridColumnGap={8}>
              <GridItem>
                <Text variant={'lg_medium'} color={'text.700'} mb={1}>
                  Asset address on Ethereum
                </Text>
                <Input
                  ref={addressInputRef}
                  placeholder={'Please fill in contract address on Ethereum'}
                  min={0}
                  maxLength={79}
                />
              </GridItem>
              <GridItem>
                <Text variant={'lg_medium'} color={'text.700'} mb={1}>
                  Asset address on Mina
                </Text>
                <Input
                  placeholder={'Please fill in contract address on Mina'}
                  min={0}
                  maxLength={79}
                />
              </GridItem>
              <GridItem>
                <Text variant={'lg_medium'} color={'text.700'} mb={1}>
                  Asset name
                </Text>
                <Input
                  placeholder={'Asset name'}
                  type={'number'}
                  min={0}
                  maxLength={79}
                />
              </GridItem>
            </Grid>
            <Grid gridTemplateColumns={'repeat(2, 1fr)'} gridColumnGap={8}>
              <GridItem>
                <Text variant={'lg_medium'} color={'text.700'} mb={1}>
                  Minimum Tokens to bridge
                </Text>
                <Input
                  placeholder={'0'}
                  type={'number'}
                  min={0}
                  maxLength={79}
                />
              </GridItem>
              <GridItem>
                <Text variant={'lg_medium'} color={'text.700'} mb={1}>
                  Maximum Tokens to bridge
                </Text>
                <Input
                  placeholder={'0'}
                  type={'number'}
                  min={0}
                  maxLength={79}
                />
              </GridItem>
            </Grid>
          </>
        )}
      </Grid>
      <VStack w={'full'} alignItems={'flex-end'} mt={4} mb={2}>
        <Button w={'140px'} variant={'primary.orange.solid'}>
          Save
        </Button>
      </VStack>
    </VStack>
  );
}
