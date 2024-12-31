'use client';
import { Box, Flex, Heading, Table, Text, VStack } from '@chakra-ui/react';

import { useAssetsState } from './context';
import EmptyHistoryData from './partials/empty.assetsData';
import SearchBar from './partials/search.assets';
import BodyTable from './partials/table.body';
import HeaderTable from './partials/table.header';
import Pagination from './partials/table.pagination';

function AssetsContent() {
  const { state } = useAssetsState();

  return (
    <VStack
      gap={'0'}
      w={'full'}
      alignItems={'flex-start'}
      padding={'40px 54px'}
    >
      <Flex w={'full'} align={'center'} justify={'space-between'} mb={'12px'}>
        <Heading as={'h1'} variant={'h1'} display={'flex'}>
          Asset
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

export default AssetsContent;
