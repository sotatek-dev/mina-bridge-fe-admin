'use client';
import {
  Badge,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useMemo, useRef, useState } from 'react';

import { useConfigState } from '../context';
import useConfigLogic from '../hooks/useConfigLogic';

import { getDecimalPosition } from '@/helpers/common';
import useNotifier from '@/hooks/useNotifier';
import { NETWORK_NAME } from '@/models/network';
import { getPersistSlice, useAppSelector } from '@/store';

type ConfigContractProps = {
  isConnected: boolean;
};

export default function ConfigContract({ isConnected }: ConfigContractProps) {
  const { value, assetRange, displayedConfig, isMinMaxLoading } =
    useConfigState().state;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { sendNotification, checkNotifyActive } = useNotifier();
  const notifyRef = useRef<any>(null);

  const { setValue } = useConfigState().methods;
  const { updateContractConfig } = useConfigLogic();
  const { lastNetworkName } = useAppSelector(getPersistSlice);

  const onChangeMinAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading || !isConnected) {
      e.preventDefault();
    }
    const posPoint = getDecimalPosition(e.currentTarget.value);
    if (
      (posPoint <= e.currentTarget.value.length - 5 && posPoint !== -1) ||
      e.currentTarget.value.length > 79
    ) {
      e.preventDefault();
      return;
    }
    setValue({ min: e.currentTarget.value, max: value.max });
  };

  const onChangeMaxAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading || !isConnected) {
      e.preventDefault();
    }
    const posPoint = getDecimalPosition(e.currentTarget.value);
    if (
      (posPoint <= e.currentTarget.value.length - 5 && posPoint !== -1) ||
      e.currentTarget.value.length > 79
    ) {
      e.preventDefault();
      return;
    }
    setValue({ max: e.currentTarget.value, min: value.min });
  };

  const disable = useMemo(() => {
    if (!value.min && !value.max) return true;
    return false;
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
      e.preventDefault();
    }
  };

  const handleUpdateConfig = async () => {
    if (disable || isLoading) return;

    const maxValue = !!value.max ? value.max : assetRange[1];
    const minValue = !!value.min ? value.min : assetRange[0];
    if (
      Number(minValue) > Number(maxValue) ||
      Number(maxValue) > Number(displayedConfig.dailyQuota)
    ) {
      if (notifyRef.current !== null && checkNotifyActive(notifyRef.current))
        return;
      notifyRef.current = sendNotification({
        toastType: 'error',
        options: {
          title: 'Invalid amount',
        },
      });
      return;
    }
    setIsLoading(true);
    await updateContractConfig();
    setValue({ max: '', min: '' });
    setIsLoading(false);
  };

  return (
    <Flex bg={'text.25'} w={'full'} padding={'22px 35px'}>
      <VStack w={'50%'} alignItems={'flex-start'}>
        <Flex alignItems={'center'} mb={'15px'}>
          <Image
            src={`/assets/logos/logo.${lastNetworkName}.circle.svg`}
            mr={'10px'}
            w={'40px'}
          />
          <Heading as={'h4'} variant={'h4'}>
            {lastNetworkName === NETWORK_NAME.ETHEREUM ? 'ETH' : 'MINA'}
          </Heading>
        </Flex>
        <Badge variant={'primary.purple.015'}>
          <Image
            mr={'6px'}
            w={'16px'}
            src={`/assets/logos/logo.${lastNetworkName}.circle.svg`}
          />
          <Text textTransform={'capitalize'}>{lastNetworkName}</Text>
        </Badge>
      </VStack>

      {isMinMaxLoading ? (
        <VStack w={'50%'} alignItems={'flex-end'}>
          <VStack w={'full'} alignItems={'flex-start'}>
            <Skeleton h={'22.4px'} w={'100%'} />
            <Skeleton h={12} w={'100%'} />
          </VStack>
          <VStack w={'full'} alignItems={'flex-start'}>
            <Skeleton h={'22.4px'} w={'100%'} />
            <Skeleton h={12} w={'100%'} />
          </VStack>
          <Skeleton h={10} w={'191px'} />
        </VStack>
      ) : (
        <VStack w={'50%'} alignItems={'flex-end'}>
          <VStack w={'full'} alignItems={'flex-start'}>
            <Text variant={'lg_medium'}>Minimum Tokens to bridge</Text>
            <Input
              placeholder={assetRange[0]}
              size={'md_medium'}
              type={'number'}
              isDisabled={!isConnected || isLoading}
              onChange={onChangeMinAmount}
              min={0}
              maxLength={79}
              onKeyDown={handleKeyDown}
              value={value.min}
            />
          </VStack>
          <VStack w={'full'} alignItems={'flex-start'}>
            <Text variant={'lg_medium'} mt={'20px'}>
              Maximum Tokens to bridge
            </Text>

            <Input
              placeholder={assetRange[1]}
              size={'md_medium'}
              type={'number'}
              isDisabled={!isConnected || isLoading}
              onChange={onChangeMaxAmount}
              min={0}
              maxLength={79}
              onKeyDown={handleKeyDown}
              value={value.max}
            />
          </VStack>
          <Button
            variant={
              !isConnected || isLoading || disable
                ? 'ghost'
                : 'primary.orange.solid'
            }
            w={'191px'}
            onClick={handleUpdateConfig}
          >
            Save
          </Button>
        </VStack>
      )}
    </Flex>
  );
}
