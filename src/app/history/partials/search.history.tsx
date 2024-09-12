'use client';
import {
  Box,
  Image,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';

import useHistoryLogic from '../hooks/useHistoryLogic';

function SearchBar() {
  const { handleSearch } = useHistoryLogic();
  return (
    <Box w={'323px'}>
      <InputGroup>
        <Input
          pr={'40px'}
          size={'md_medium'}
          onChange={handleSearch}
          placeholder={'Search by Wallet Address'}
          onWheel={(e) => e.currentTarget.blur()}
        />
        <InputRightElement w={'unset'} h={'48px'} pr={'12px'}>
          <Image src={'/assets/icons/icon.search.svg'} />
        </InputRightElement>
      </InputGroup>
    </Box>
  );
}

export default SearchBar;
