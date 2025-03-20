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
  dailyQuotaPerAddress: '0',
  dailyQuotaSystem: '0',
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
  const [dailyQuotaPerAddress, setDailyQuotaPerAddress] = useState<string>('');
  const [dailyQuotaSystem, setDailyQuotaSystem] = useState<string>('');
  const [tip, setTip] = useState<string>('');
  const [feeUnlockMina, setFeeUnlockMina] = useState<string>('');
  const [feeUnlockEth, setFeeUnlockEth] = useState<string>('');

  const disable = useMemo(() => {
    if (
      !tip &&
      !dailyQuotaPerAddress &&
      !dailyQuotaSystem &&
      !feeUnlockEth &&
      !feeUnlockMina
    )
      return true;
    return false;
  }, [
    tip,
    dailyQuotaPerAddress,
    dailyQuotaSystem,
    feeUnlockEth,
    feeUnlockMina,
  ]);

  // const handleChangeDailyQuota = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (isLoading || !isConnected) {
  //     e.preventDefault();
  //   }
  //   const posPoint = getDecimalPosition(e.currentTarget.value);
  //   if (
  //     (posPoint <= e.currentTarget.value.length - 5 && posPoint !== -1) ||
  //     e.currentTarget.value.length > 79
  //   ) {
  //     e.preventDefault();
  //     return;
  //   }
  //   setDailyQuota(e.currentTarget.value);
  // };

  const handleChangeDailyQuotaPerAddress = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    setDailyQuotaPerAddress(e.currentTarget.value);
  };

  const handleChangeDailyQuotaSystem = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    setDailyQuotaSystem(e.currentTarget.value);
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
      e.currentTarget.value.length > 79
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
      e.currentTarget.value.length > 79
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
      dailyQuotaPerAddress,
      dailyQuotaSystem,
      feeUnlockEth,
      feeUnlockMina,
    });
    if (res) {
      setDisplayedConfig({
        tip: !!tip ? tip : displayedConfig.tip,
        dailyQuotaPerAddress: !!dailyQuotaPerAddress
          ? dailyQuotaPerAddress
          : displayedConfig.dailyQuotaPerAddress,
        dailyQuotaSystem: !!dailyQuotaSystem
          ? dailyQuotaSystem
          : displayedConfig.dailyQuotaSystem,
        feeUnlockEth: !!feeUnlockEth
          ? feeUnlockEth
          : displayedConfig.feeUnlockEth,
        feeUnlockMina: !!feeUnlockMina
          ? feeUnlockMina
          : displayedConfig.feeUnlockMina,
      });
      setTip('');
      setDailyQuotaPerAddress('');
      setDailyQuotaSystem('');
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
      <VStack bg={'text.25'} w={'full'} padding={'22px 35px'} gap={5}>
        <Flex gap={6} w={'100%'}>
          <VStack w={'full'} alignItems={'flex-start'}>
            <Skeleton h={'22.4px'} w={'100%'} />
            <Skeleton h={12} w={'100%'} />
          </VStack>
          <VStack w={'full'} alignItems={'flex-start'}>
            <Skeleton h={'22.4px'} w={'100%'} />
            <Skeleton h={12} w={'100%'} />
          </VStack>
        </Flex>

        <Flex gap={6} w={'100%'}>
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
        </Flex>

        <Flex w={'100%'} justifyContent={'flex-end'}>
          <Skeleton h={10} w={'191px'} />
        </Flex>
      </VStack>
    );

  return (
    <VStack bg={'text.25'} w={'full'} padding={'22px 35px'} gap={5}>
      <Flex gap={6} w={'100%'}>
        <VStack w={'full'} alignItems={'flex-start'}>
          <Text variant={'lg_medium'}>Daily Quota (system-wide)</Text>
          <Input
            placeholder={String(Number(displayedConfig.dailyQuotaSystem))}
            size={'md_medium'}
            type={'number'}
            isDisabled={!isConnected}
            value={dailyQuotaSystem}
            onChange={handleChangeDailyQuotaSystem}
            maxLength={79}
            min={0}
            onKeyDown={handleKeyDown}
          />
        </VStack>
        <VStack w={'full'} alignItems={'flex-start'}>
          <Text variant={'lg_medium'}>Daily Quota (per address)</Text>
          <Input
            placeholder={String(Number(displayedConfig.dailyQuotaPerAddress))}
            size={'md_medium'}
            type={'number'}
            isDisabled={!isConnected}
            value={dailyQuotaPerAddress}
            min={0}
            onChange={handleChangeDailyQuotaPerAddress}
            onKeyDown={handleKeyDown}
          />
        </VStack>
      </Flex>

      <Flex gap={6} w={'100%'}>
        <VStack w={'full'} alignItems={'flex-start'}>
          <Text variant={'lg_medium'}>Unlocking Fee</Text>
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
          <Text variant={'lg_medium'}>Minting Fee</Text>
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
        <VStack w={'full'} alignItems={'flex-start'}>
          <Text variant={'lg_medium'}>Bridging Fee (%)</Text>
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
      </Flex>

      <Flex w={'100%'} justifyContent={'flex-end'}>
        <Button
          variant={!isConnected || disable ? 'ghost' : 'primary.orange.solid'}
          w={'191px'}
          onClick={handleUpdateConfig}
        >
          Save
        </Button>
      </Flex>
    </VStack>
  );
}
