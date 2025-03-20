'use client';
import { Box, Flex, Heading, Table, Text, VStack } from '@chakra-ui/react';

import { useHistoryState } from './context';
import EmptyHistoryData from './partials/empty.historyData';
import SearchBar from './partials/search.history';
import BodyTable from './partials/table.body';
import HeaderTable from './partials/table.header';
import Pagination from './partials/table.pagination';

import { getUISlice, useAppSelector } from '@/store';
import { BANNER_NAME } from '@/store/slices/uiSlice';

function HistoryContent() {
  const { state } = useHistoryState();
  const { banners } = useAppSelector(getUISlice);

  const curBanner = banners[BANNER_NAME.UNMATCHED_CHAIN_ID];

  return (
    <VStack
      mt={curBanner.isDisplay && curBanner.payload ? '50px' : '0'}
      gap={'0'}
      w={'full'}
      alignItems={'flex-start'}
      padding={'40px 54px'}
    >
      <Flex w={'full'} align={'center'} justify={'space-between'}>
        <Heading as={'h1'} variant={'h1'} mb={'12px'}>
          Transaction History
        </Heading>
        <SearchBar />
      </Flex>
      <VStack w={'full'} bg={'text.25'} pb={'33px'} mt={'12px'}>
        <Box
          width={'full'}
          overflowX={state.data.length > 0 ? 'auto' : 'hidden'}
        >
          <Table minW={'1140px'}>
            <HeaderTable />
            {state.data.length !== 0 && <BodyTable data={state.data} />}
          </Table>
        </Box>
        {!state.data.length ? <EmptyHistoryData /> : <Pagination />}
      </VStack>
    </VStack>
  );
}

export default HistoryContent;
