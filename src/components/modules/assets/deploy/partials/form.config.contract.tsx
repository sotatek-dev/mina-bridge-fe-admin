'use client';
import {
  Grid,
  GridItem,
  HStack,
  Input,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useDeployState } from '../context';

import { Action } from '@/constants';
import { getDecimalPosition } from '@/helpers/common';
import { validateAddress } from '@/helpers/validateField';

type ConfigContractProps = {
  isConnected: boolean;
};

export default function ConfigDeployContract({
  isConnected,
}: ConfigContractProps) {
  const addressInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (addressInputRef) {
      addressInputRef?.current?.focus();
    }
  }, [addressInputRef]);

  const { value, fetchedValue, isLoading, isInitLoading } =
    useDeployState().state;
  const { setValue, setIsError } = useDeployState().methods;
  const params = useSearchParams();

  const action = useMemo(() => {
    return params.get('action');
  }, [params]);

  const [addressError, setAddressError] = useState('');

  const handleChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading || !isConnected) {
      e.preventDefault();
    }
    setAddressError('');
    setValue({ ...value, assetAddress: e.currentTarget.value });
  };

  const handleBlurAddress = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const skipAddress =
      action === Action.RE_DEPLOY ? fetchedValue.assetAddress : undefined;
    const error = await validateAddress(e.currentTarget.value, skipAddress);
    if (error) {
      setAddressError(error);
      setIsError(true);
    } else {
      setAddressError('');
      setIsError(false);
    }
  };

  const handleKeyDownAddress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ([' '].includes(e.key)) {
      e.preventDefault();
    }
  };

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
    setValue({ ...value, minAmountToBridge: e.currentTarget.value });
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
    setValue({ ...value, maxAmountToBridge: e.currentTarget.value });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
      e.preventDefault();
    }
  };

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
        {isInitLoading ? (
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
                isDisabled={true}
                value={value.assetAddress}
                onChange={handleChangeAddress}
                onBlur={handleBlurAddress}
                onKeyDown={handleKeyDownAddress}
              />
              {!!addressError && (
                <Text variant={'md'} color={'red.500'} mb={1}>
                  {addressError}
                </Text>
              )}
            </GridItem>
            <GridItem>
              <Text variant={'lg_medium'} color={'text.700'} mb={1}>
                Asset name
              </Text>
              <Input
                isDisabled={true}
                placeholder={'Asset name'}
                value={value.assetName}
              />
            </GridItem>
            <GridItem>
              <Text variant={'lg_medium'} color={'text.700'} mb={1}>
                Minimum Tokens to bridge
              </Text>
              <Input
                placeholder={'0'}
                type={'number'}
                min={0}
                maxLength={79}
                isDisabled={true}
                value={value.minAmountToBridge}
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
                isDisabled={true}
                value={value.maxAmountToBridge}
                onChange={handleChangeMaxAmount}
                onKeyDown={handleKeyDown}
              />
            </GridItem>
          </>
        )}
      </Grid>
    </HStack>
  );
}
