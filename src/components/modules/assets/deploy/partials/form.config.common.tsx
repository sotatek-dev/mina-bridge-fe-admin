'use client';
import {
  Grid,
  GridItem,
  HStack,
  Input,
  Skeleton,
  Text,
} from '@chakra-ui/react';

import { useDeployState } from '../context';

import { getDecimalPosition } from '@/helpers/common';

type ConfigContractProps = {
  isConnected: boolean;
};

export default function ConfigDeployCommon({
  isConnected,
}: ConfigContractProps) {
  const { value, isLoading, isInitLoading } = useDeployState().state;
  const { setValue } = useDeployState().methods;

  const handleChangeDailyQuota = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setValue({ ...value, dailyQuota: e.currentTarget.value });
  };

  const handleChangeBridgeFee = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isConnected) {
      e.preventDefault();
    }
    setValue({ ...value, bridgeFee: e.currentTarget.value });
  };

  const handleChangeFeeUnlockMina = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (isLoading || !isConnected) {
      e.preventDefault();
      return;
    }
    const posPoint = getDecimalPosition(e.currentTarget.value);
    if (
      (posPoint <= e.currentTarget.value.length - 10 && posPoint !== -1) ||
      Number(e.currentTarget.value) > 100
    ) {
      e.preventDefault();
      return;
    }
    setValue({ ...value, mintingFee: e.currentTarget.value });
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
    setValue({ ...value, unlockingFee: e.currentTarget.value });
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
                Daily Quota
              </Text>
              <Input
                placeholder={'0'}
                type={'number'}
                min={0}
                maxLength={79}
                isDisabled={true}
                value={value.dailyQuota}
                onChange={handleChangeDailyQuota}
                onKeyDown={handleKeyDown}
              />
            </GridItem>
            <GridItem>
              <Text variant={'lg_medium'} color={'text.700'} mb={1}>
                Bridge fee %
              </Text>
              <Input
                placeholder={'0'}
                type={'number'}
                min={0}
                maxLength={79}
                isDisabled={true}
                value={value.bridgeFee}
                onChange={handleChangeBridgeFee}
              />
            </GridItem>
            <GridItem>
              <Text variant={'lg_medium'} color={'text.700'} mb={1}>
                Unlocking fee
              </Text>
              <Input
                placeholder={'0'}
                type={'number'}
                min={0}
                maxLength={79}
                isDisabled={true}
                value={value.unlockingFee}
                onChange={handleChangeFeeUnlockEth}
              />
            </GridItem>
            <GridItem>
              <Text variant={'lg_medium'} color={'text.700'} mb={1}>
                Minting fee
              </Text>
              <Input
                placeholder={'0'}
                type={'number'}
                min={0}
                maxLength={79}
                isDisabled={true}
                value={value.mintingFee}
                onChange={handleChangeFeeUnlockMina}
              />
            </GridItem>
          </>
        )}
      </Grid>
    </HStack>
  );
}
