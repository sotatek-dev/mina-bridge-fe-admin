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

import { useDetailState } from '../context';
import useScLogic from '../hooks/useScLogic';

import { getDecimalPosition } from '@/helpers/common';

type ConfigContractProps = {
  isConnected: boolean;
};

export default function ConfigDetailContract({
  isConnected,
}: ConfigContractProps) {
  const { viewValue, minMaxValue, isLoading, isInitLoading } =
    useDetailState().state;
  const { setMinMaxValue } = useDetailState().methods;
  const { minMaxDisable, handleUpdateMinMax } = useScLogic();

  const handleChangeMinAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading || !isConnected) {
      e.preventDefault();
      return;
    }
    const posPoint = getDecimalPosition(e.currentTarget.value);
    if (
      (posPoint <= e.currentTarget.value.length - 5 && posPoint !== -1) ||
      e.currentTarget.value.length > 79
    ) {
      e.preventDefault();
      return;
    }
    setMinMaxValue({
      ...minMaxValue,
      minAmountToBridge: e.currentTarget.value,
    });
  };

  const handleChangeMaxAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isConnected) {
      e.preventDefault();
      return;
    }
    const posPoint = getDecimalPosition(e.currentTarget.value);
    if (
      (posPoint <= e.currentTarget.value.length - 5 && posPoint !== -1) ||
      e.currentTarget.value.length > 79
    ) {
      e.preventDefault();
      return;
    }
    setMinMaxValue({
      ...minMaxValue,
      maxAmountToBridge: e.currentTarget.value,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
      e.preventDefault();
    }
  };

  return (
    <VStack w={'full'}>
      <Grid bg={'text.25'} w={'full'} px={9} py={8} gridRowGap={4}>
        {isInitLoading ? (
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
                  placeholder={'Please fill in contract address on Ethereum'}
                  value={viewValue.evmAddress}
                  opacity={'1 !important'}
                  isDisabled
                />
              </GridItem>
              <GridItem>
                <Text variant={'lg_medium'} color={'text.700'} mb={1}>
                  Asset address on Mina
                </Text>
                <Input
                  placeholder={'Please fill in contract address on Mina'}
                  value={viewValue.minaAddress}
                  opacity={'1 !important'}
                  isDisabled
                />
              </GridItem>
              <GridItem>
                <Text variant={'lg_medium'} color={'text.700'} mb={1}>
                  Asset name
                </Text>
                <Input
                  placeholder={'Asset name'}
                  value={viewValue.assetName}
                  opacity={'1 !important'}
                  isDisabled
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
                  isDisabled={!isConnected || isLoading}
                  value={minMaxValue.minAmountToBridge}
                  onChange={handleChangeMinAmount}
                  onKeyDown={handleKeyDown}
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
                  isDisabled={!isConnected || isLoading}
                  value={minMaxValue.maxAmountToBridge}
                  onChange={handleChangeMaxAmount}
                  onKeyDown={handleKeyDown}
                />
              </GridItem>
            </Grid>
          </>
        )}
      </Grid>
      <VStack w={'full'} alignItems={'flex-end'} mt={4} mb={2}>
        <Button
          w={'140px'}
          variant={
            !isConnected || isLoading || minMaxDisable
              ? 'ghost'
              : 'primary.orange.solid'
          }
          // isLoading={isLoading}
          isDisabled={!isConnected || isLoading || minMaxDisable}
          onClick={handleUpdateMinMax}
          _hover={{
            background:
              !isConnected || isLoading || minMaxDisable
                ? 'ghost'
                : 'primary.orange.solid',
            opacity: 0.4,
            border: 'none',
          }}
        >
          Save
        </Button>
      </VStack>
    </VStack>
  );
}
