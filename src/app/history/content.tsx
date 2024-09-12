'use client';
import { Flex, Heading, Table, Text, VStack } from '@chakra-ui/react';

import { useHistoryState } from './context';
import EmptyHistoryData from './partials/empty.historyData';
import SearchBar from './partials/search.history';
import BodyTable from './partials/table.body';
import HeaderTable from './partials/table.header';
import Pagination from './partials/table.pagination';

function HistoryContent() {
  const { state } = useHistoryState();

  return (
    <VStack
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
        <Table>
          <HeaderTable />
          {state.data.length !== 0 && <BodyTable data={state.data} />}
        </Table>
        {!state.data.length ? <EmptyHistoryData /> : <Pagination />}
      </VStack>
    </VStack>
  );
}

export default HistoryContent;
