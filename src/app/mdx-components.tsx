import { Link } from '@chakra-ui/next-js';
import { Flex, Heading, Image, Text } from '@chakra-ui/react';
import type { MDXComponents } from 'mdx/types';

import { getPxFromUrl } from '@/helpers/common';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h4: ({ children }) => (
      <Heading as={'h4'} variant={'h4'}>
        {children}
      </Heading>
    ),
    p: ({ children }) => (
      <Text py={'10px'} variant={'xl'}>
        {children}
      </Text>
    ),
    img: (props) => (
      <Flex w={'full'} justifyContent={'center'}>
        <Image
          style={{ border: 'solid 1px #000' }}
          width={getPxFromUrl(props.src)}
          {...props}
        />
      </Flex>
    ),
    li: ({ children }) => <li style={{ marginLeft: '30px' }}>{children}</li>,
    a: ({ href, children, ...props }) => (
      <Link href={href || '/'} color={'blue.500'} {...props}>
        {children}
      </Link>
    ),

    ...components,
  };
}
