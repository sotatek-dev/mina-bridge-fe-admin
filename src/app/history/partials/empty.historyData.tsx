'use client';
import { Box, Heading, Image, VStack } from '@chakra-ui/react';

type Props = {};

export default function EmptyHistoryData({}: Props) {
  return (
    <VStack w={'full'} justifyContent={'center'} mt={'66px'}>
      <Box w={'490px'} h={'235px'}>
        <Image w={'full'} src={'/assets/images/image.empty-history.svg'} />
      </Box>
      <Heading as={'h3'} variant={'h3'} mt={'25px'} color={'text.500'}>
        Sorry! No result
      </Heading>
    </VStack>
  );
}
