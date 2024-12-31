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

type ConfigContractProps = {
  isConnected: boolean;
};

export default function ConfigDetailCommon({
  isConnected,
}: ConfigContractProps) {
  const isLoading = false;
  return (
    <VStack w={'full'}>
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
      <VStack w={'full'} alignItems={'flex-end'} mt={4}>
        <Button w={'140px'} variant={'primary.orange.solid'}>
          Save
        </Button>
      </VStack>
    </VStack>
  );
}
