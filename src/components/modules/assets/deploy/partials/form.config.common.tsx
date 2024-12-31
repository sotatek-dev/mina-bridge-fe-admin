'use client';
import {
  Grid,
  GridItem,
  HStack,
  Input,
  Skeleton,
  Text,
} from '@chakra-ui/react';

type ConfigContractProps = {
  isConnected: boolean;
};

export default function ConfigDeployCommon({
  isConnected,
}: ConfigContractProps) {
  const isLoading = false;
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
                Daily Quota
              </Text>
              <Input placeholder={'0'} type={'number'} min={0} maxLength={79} />
            </GridItem>
            <GridItem>
              <Text variant={'lg_medium'} color={'text.700'} mb={1}>
                Bridge fee %
              </Text>
              <Input placeholder={'0'} type={'number'} min={0} maxLength={79} />
            </GridItem>
            <GridItem>
              <Text variant={'lg_medium'} color={'text.700'} mb={1}>
                Unlocking fee
              </Text>
              <Input placeholder={'0'} type={'number'} min={0} maxLength={79} />
            </GridItem>
            <GridItem>
              <Text variant={'lg_medium'} color={'text.700'} mb={1}>
                Minting fee
              </Text>
              <Input placeholder={'0'} type={'number'} min={0} maxLength={79} />
            </GridItem>
          </>
        )}
      </Grid>
    </HStack>
  );
}
