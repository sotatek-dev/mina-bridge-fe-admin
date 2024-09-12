'use client';
import { Flex, FlexProps, Image } from '@chakra-ui/react';

import { useHistoryState } from '../context';

import ReactPaginateWithChakra from '@/components/elements/pagination';

const btnNavigateStyles: FlexProps = {
  border: '1px solid rgba(28, 34, 55, 0.10)',
  borderRadius: '4px',
  w: '35px',
  h: '35px',
  justify: 'center',
  margin: '4px',
};

function Pagination() {
  const { state, methods } = useHistoryState();

  const handlePageClick = (value: number) => {
    methods.updateMetaData({ ...state.pagingData, currentPage: value + 1 });
  };
  return (
    <Flex flexDirection={'row'}>
      <ReactPaginateWithChakra
        breakLabel={'...'}
        previousLabel={
          <Flex {...btnNavigateStyles}>
            <Image src={'/assets/icons/icon.arrow.left.pagination.svg'} />
          </Flex>
        }
        onPageChange={(selectedItem) => handlePageClick(selectedItem.selected)}
        pageRangeDisplayed={2}
        pageCount={state.pagingData.totalOfPages}
        nextLabel={
          <Flex {...btnNavigateStyles}>
            <Image src={'/assets/icons/icon.arrow.right.pagination.svg'} />
          </Flex>
        }
        renderOnZeroPageCount={null}
        gap={'5'}
        listStyleType={'none'}
        display={'flex'}
        alignItems={'center'}
        pageClassName={'custom-pagination__item'}
        activeClassName={'custom-pagination__item-active'}
        sx={{
          '.custom-pagination__item': {
            width: '35px',
            height: '35px',
            lineHeight: '35px',
            textAlign: 'center',
            border: 'solid 1px #1c22371a',
            borderRadius: '4px',
            color: 'text.700',
            a: {
              display: 'block',
              width: 'full',
            },
            '&-active': {
              bg: 'primary.purple',
              color: 'white',
            },
          },
        }}
      />
    </Flex>
  );
}

export default Pagination;
