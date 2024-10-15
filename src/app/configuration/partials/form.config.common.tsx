'use client';
import { Button, Flex, Input, Skeleton, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';

import { useConfigState } from '../context';
import useConfigLogic from '../hooks/useConfigLogic';

import { getDecimalPosition } from '@/helpers/common';
import { CommonConfigResponse } from '@/services/adminService';

type ConfigCommonProps = {
  isConnected: boolean;
};

const initCommonConfig: CommonConfigResponse = {
  id: 0,
  dailyQuota: '0',
  tip: '0',
  asset: 'ETH',
  feeUnlockMina: '0',
  feeUnlockEth: '0',
};

export default function ConfigCommon({ isConnected }: ConfigCommonProps) {
  const { isLoading, isMinMaxLoading, displayedConfig } =
    useConfigState().state;
  const { setDisplayedConfig } = useConfigState().methods;

  const { updateCommonConfig, getCommonConfig } = useConfigLogic();

  const [currentConfig, setCurrentConfig] =
    useState<CommonConfigResponse>(initCommonConfig);
  const [dailyQuota, setDailyQuota] = useState<string>('');
  const [tip, setTip] = useState<string>('');
  const [feeUnlockMina, setFeeUnlockMina] = useState<string>('');
  const [feeUnlockEth, setFeeUnlockEth] = useState<string>('');

  const disable = useMemo(() => {
    if (!tip && !dailyQuota && !feeUnlockEth && !feeUnlockMina) return true;
    return false;
  }, [tip, dailyQuota, feeUnlockEth, feeUnlockMina]);

  const handleChangeDailyQuota = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setDailyQuota(e.currentTarget.value);
  };

  const handleChangeTip = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading || !isConnected) {
      e.preventDefault();
    }
    const posPoint = getDecimalPosition(e.currentTarget.value);
    if (
      (posPoint <= e.currentTarget.value.length - 5 && posPoint !== -1) ||
      Number(e.currentTarget.value) > 100
    ) {
      e.preventDefault();
      return;
    }
    setTip(e.currentTarget.value);
  };

  const handleChangeFeeUnlockMina = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (isLoading || !isConnected) {
      e.preventDefault();
    }
    const posPoint = getDecimalPosition(e.currentTarget.value);
    if (
      (posPoint <= e.currentTarget.value.length - 10 && posPoint !== -1) ||
      Number(e.currentTarget.value) > 100
    ) {
      e.preventDefault();
      return;
    }
    setFeeUnlockMina(e.currentTarget.value);
  };

  const handleChangeFeeUnlockEth = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading || !isConnected) {
      e.preventDefault();
    }
    const posPoint = getDecimalPosition(e.currentTarget.value);
    if (
      (posPoint <= e.currentTarget.value.length - 19 && posPoint !== -1) ||
      Number(e.currentTarget.value) > 100
    ) {
      e.preventDefault();
      return;
    }
    setFeeUnlockEth(e.currentTarget.value);
  };

  const handleUpdateConfig = async () => {
    if (disable) return;

    const res = await updateCommonConfig({
      id: currentConfig.id,
      tip,
      dailyQuota,
      feeUnlockEth,
      feeUnlockMina,
    });
    if (res) {
      setDisplayedConfig({
        tip: !!tip ? tip : displayedConfig.tip,
        dailyQuota: !!dailyQuota ? dailyQuota : displayedConfig.dailyQuota,
        feeUnlockEth: !!feeUnlockEth
          ? feeUnlockEth
          : displayedConfig.feeUnlockEth,
        feeUnlockMina: !!feeUnlockMina
          ? feeUnlockMina
          : displayedConfig.feeUnlockMina,
      });
      setTip('');
      setDailyQuota('');
      setFeeUnlockEth('');
      setFeeUnlockMina('');
    }
  };

  const getCurrentConfig = async () => {
    const config = await getCommonConfig();
    if (!config) return;
    setCurrentConfig(config);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
      e.preventDefault();
    }
  };

  useEffect(() => {
    getCurrentConfig();
  }, []);

  if (isMinMaxLoading)
    return (
      <Flex
        bg={'text.25'}
        w={'full'}
        padding={'22px 35px'}
        justifyContent={'space-between'}
      >
        <VStack w={'49%'} alignItems={'flex-end'}>
          <VStack w={'full'} alignItems={'flex-start'}>
            <Skeleton h={'22.4px'} w={'100%'} />
            <Skeleton h={12} w={'100%'} />
          </VStack>
          <VStack w={'full'} alignItems={'flex-start'}>
            <Skeleton h={'22.4px'} w={'100%'} />
            <Skeleton h={12} w={'100%'} />
          </VStack>
        </VStack>
        <VStack w={'49%'} alignItems={'flex-end'}>
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
      </Flex>
    );

  return (
    <Flex
      bg={'text.25'}
      w={'full'}
      padding={'22px 35px'}
      justifyContent={'space-between'}
    >
      <VStack w={'49%'} alignItems={'flex-start'}>
        <VStack w={'full'} alignItems={'flex-start'}>
          <Text variant={'lg_medium'}>ETH Unlock Fee</Text>
          <Input
            placeholder={displayedConfig.feeUnlockEth}
            size={'md_medium'}
            type={'number'}
            isDisabled={!isConnected}
            value={feeUnlockEth}
            onChange={handleChangeFeeUnlockEth}
            maxLength={79}
            min={0}
            onKeyDown={handleKeyDown}
          />
        </VStack>
        <VStack w={'full'} alignItems={'flex-start'}>
          <Text variant={'lg_medium'} mt={'20px'}>
            MINA Unlock Fee
          </Text>
          <Input
            placeholder={displayedConfig.feeUnlockMina}
            size={'md_medium'}
            type={'number'}
            isDisabled={!isConnected}
            value={feeUnlockMina}
            onChange={handleChangeFeeUnlockMina}
            maxLength={79}
            min={0}
            onKeyDown={handleKeyDown}
          />
        </VStack>
      </VStack>
      {isMinMaxLoading ? (
        <VStack w={'48%'} alignItems={'flex-end'}>
          <VStack w={'full'} alignItems={'flex-start'}>
            <Skeleton h={'22.4px'} w={'100%'} />
            <Skeleton h={12} w={'100%'} />
          </VStack>
          <VStack w={'full'} alignItems={'flex-start'}>
            <Skeleton h={'22.4px'} w={'100%'} />
            <Skeleton h={12} w={'100%'} />
          </VStack>
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
        <VStack w={'49%'} alignItems={'flex-end'}>
          <VStack w={'full'} alignItems={'flex-start'}>
            <Text variant={'lg_medium'}>Daily Quota</Text>
            <Input
              placeholder={String(Number(displayedConfig.dailyQuota))}
              size={'md_medium'}
              type={'number'}
              isDisabled={!isConnected}
              value={dailyQuota}
              min={0}
              onChange={handleChangeDailyQuota}
              onKeyDown={handleKeyDown}
            />
          </VStack>
          <VStack w={'full'} alignItems={'flex-start'}>
            <Text variant={'lg_medium'} mt={'20px'}>
              Bridging Fee (%)
            </Text>
            <Input
              placeholder={String(Number(displayedConfig.tip))}
              size={'md_medium'}
              type={'number'}
              isDisabled={!isConnected}
              value={tip}
              onChange={handleChangeTip}
              maxLength={79}
              min={0}
              onKeyDown={handleKeyDown}
            />
          </VStack>
          <Button
            variant={!isConnected || disable ? 'ghost' : 'primary.orange.solid'}
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
