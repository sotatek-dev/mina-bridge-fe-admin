'use client';
import {
  Flex,
  FlexProps,
  Image,
  ImageProps,
  Text,
  TextProps,
} from '@chakra-ui/react';

import { WalletLogo } from '@/models/wallet/wallet.abstract';

export enum CARD_STATUS {
  SUPPORTED = 'supported',
  UNSUPPORTED = 'unsupported',
  CHECKED = 'checked',
  UNCHECKED = 'unchecked',
}

type CardProps = {
  status: CARD_STATUS;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  data: {
    title: string;
    logo: string | Record<CARD_STATUS, string> | WalletLogo;
  };
};

export default function Card(props: CardProps) {
  function getCtnStyleByStatus(): FlexProps {
    switch (props.status) {
      case CARD_STATUS.CHECKED:
        return {
          background: 'linear-gradient(270deg, #DE622E 0%, #8271F0 100%)',
        };
      case CARD_STATUS.UNSUPPORTED:
        return { background: 'text.100', cursor: 'not-allowed' };
      default:
        return { background: 'text.500', cursor: 'pointer' };
    }
  }
  const ctnStyle: FlexProps = {
    w: '130px',
    h: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    userSelect: 'none',
    ...getCtnStyleByStatus(),
    onClick: props.onClick,
  };

  function getContentCtnStyleByStatus(): FlexProps {
    switch (props.status) {
      case CARD_STATUS.CHECKED:
        return { background: 'white' };
      case CARD_STATUS.UNSUPPORTED:
        return { background: 'text.100' };
      default:
        return { background: 'white' };
    }
  }

  const contentCtnStyle: FlexProps = {
    w: 'calc(100% - 2px)',
    h: 'calc(100% - 2px)',
    py: '20px',
    borderRadius: '9px',
    flexDir: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    ...getContentCtnStyleByStatus(),
  };

  const checkedStyle: ImageProps = {
    w: '20px',
    h: '20px',
    src: '/assets/icons/icon.checked.svg',
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: props.status === CARD_STATUS.CHECKED ? 1 : -1,
  };

  const logoStyle: ImageProps = {
    src:
      typeof props.data.logo === 'string'
        ? props.data.logo
        : props.data.logo[props.status],
    w: '40px',
    h: '40px',
  };

  const labelStyle: TextProps = {
    color: 'text.500',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '20px',
    marginTop: '10px',
    textTransform: 'capitalize',
  };

  return (
    <Flex {...ctnStyle}>
      <Flex {...contentCtnStyle}>
        <Image {...logoStyle} />
        <Text {...labelStyle}>{props.data.title}</Text>
        <Image {...checkedStyle} />
      </Flex>
    </Flex>
  );
}
