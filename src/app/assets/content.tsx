'use client';
import { Box, Flex, Heading, Table, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';

import { useAssetsState } from './context';
import useAssetLogic from './hooks/useAssetsLogic';
import useCheckRouter from './hooks/useCheckRouter';
import BodyTable from './partials/table.body';
import EmptyHistoryData from './partials/empty.assetsData';
import SearchBar from './partials/search.assets';
import HeaderTable from './partials/table.header';
import Pagination from './partials/table.pagination';

import AssetDeploy from '@/components/modules/assets/deploy';
import AssetDetail from '@/components/modules/assets/detail';
import { Action } from '@/constants';
import { getWalletSlice, useAppSelector } from '@/store';

function AssetsContent() {
  const { state } = useAssetsState();
  const { action } = useCheckRouter();
  const { getListAssets } = useAssetLogic();
  const { isConnected } = useAppSelector(getWalletSlice);

  useEffect(() => {
    if (isConnected) {
      getListAssets('', 1);
    }
  }, [isConnected]);

  if (action === Action.CREATE || action === Action.RE_DEPLOY)
    return <AssetDeploy />;
  if (action === Action.DETAIL) return <AssetDetail />;
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
