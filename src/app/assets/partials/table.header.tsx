import { Text, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';

const header = [
  'Status',
  'Asset (Ethereum)',
  'Asset (Mina)',
  'Minimum Token to bridge',
  'Maximum Token to bridge',
  'Daily Quota',
  'Brigde fee (%)',
  'Show/Hide',
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
