import { Text, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';

const header = [
  'Status',
  'Tx From',
  'Tx To',
  'Address From',
  'Address To',
  'Bridging Fee',
  'Gas Fee',
  'Create Time',
  'Confirmed time',
  'Order ID',
];

function HeaderTable() {
  return (
    <Thead>
      <Tr borderBottom={'solid 1px'}>
        {header.map((item: string, index: number) => {
          return (
            <Th key={index}>
              <Text
                textTransform={'capitalize'}
                variant={'md_bold'}
                color={'text.900'}
                whiteSpace={'nowrap'}
              >
                {item}
              </Text>
            </Th>
          );
        })}
      </Tr>
    </Thead>
  );
}

export default React.memo(HeaderTable);
