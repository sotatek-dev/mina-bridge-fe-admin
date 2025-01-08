'use client';
import {
  Box,
  Button,
  Image,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import useAssetsLogic from '../hooks/useAssetsLogic';

import useModalLoadingDeployLogic from '@/components/modules/modals/components/modalLoadingDeploy/hooks/useModalLoadingDeployLogic';
import { Action } from '@/constants';

function SearchBar() {
  const { handleSearch } = useAssetsLogic();
  const router = useRouter();
  const { modalLoadingDeployProps } = useModalLoadingDeployLogic();

  return (
    <Box width={'100%'} display={'flex'} justifyContent={'flex-end'}>
      <Box w={'323px'} mr={'11px'}>
        <InputGroup>
          <Input
            pr={'40px'}
            size={'md_medium'}
            onChange={handleSearch}
            placeholder={'Search by asset name'}
            onWheel={(e) => e.currentTarget.blur()}
          />
          <InputRightElement w={'unset'} h={'48px'} pr={'12px'}>
            <Image src={'/assets/icons/icon.search.svg'} />
          </InputRightElement>
        </InputGroup>
      </Box>
      <Button
        {...modalLoadingDeployProps}
        w={'190px'}
        h={'44px'}
        variant={'primary.orange.solid'}
        onClick={() => router.push(`?action=${Action.CREATE}`)}
      >
        Create new asset
      </Button>
    </Box>
  );
}

export default SearchBar;
