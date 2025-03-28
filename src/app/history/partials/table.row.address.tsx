'use client';
import { Link, Text } from '@chakra-ui/react';

import { truncateMid } from '@/helpers/common';

type AddressInfoProps = {
  address: string;
};

function AddressInfo({ address }: AddressInfoProps) {
  const [fSlice, sSlice] = truncateMid(address, 4, 4);

  const getScanUrl = () => {
    if (address?.includes('B62')) {
      return `${process.env.NEXT_PUBLIC_REQUIRED_MINA_SCAN_URL}/account/${address}`;
    }
    return `${process.env.NEXT_PUBLIC_REQUIRED_ETH_SCAN_URL}/address/${address}`;
  };

  return (
    <Link href={getScanUrl()} target={'_blank'}>
      <Text variant={'md'} color={'primary.purple'} whiteSpace={'nowrap'}>
        {`${fSlice}...${sSlice}`}
      </Text>
    </Link>
  );
}

export default AddressInfo;
