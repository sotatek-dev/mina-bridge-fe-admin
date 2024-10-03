import { Image, ImageProps } from '@chakra-ui/react';
import React from 'react';

type Props = ImageProps;

export default function Logo(props: Props) {
  return (
    <Image
      width={'88px'}
      height={'25px'}
      {...props}
      src={'/assets/logos/logo.mina.text.svg'}
    />
  );
}
