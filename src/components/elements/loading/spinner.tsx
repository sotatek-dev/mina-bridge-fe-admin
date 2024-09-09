import {
  Box,
  Flex,
  keyframes,
  usePrefersReducedMotion,
} from '@chakra-ui/react';

import LoadingClip from './loadingClip';

type Props = {
  id: string;
  w?: string;
  h?: string;
  bgOpacity?: number;
  spinnerSize?: number;
  spinnerThickness?: number;
  speed?: number;
};

const spin = keyframes`
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  `;

export default function Loading({
  id,
  w = '100vw',
  h = '100vh',
  bgOpacity = 0.1,
  spinnerSize = 140,
  spinnerThickness = 5,
  speed = 1.5,
}: Props) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animation = prefersReducedMotion
    ? undefined
    : `${spin} infinite ${speed}s linear`;

  return (
    <Flex
      w={w}
      h={h}
      alignItems={"center"}
      justifyContent={"center"}
      bg={`rgba(0,0,0,${bgOpacity})`}
    >
      <Box
        w={`${spinnerSize}px`}
        h={`${spinnerSize}px`}
        clipPath={`url(#${id})`}
        position={"relative"}
        _after={{
          content: "''",
          position: 'absolute',
          w: 'full',
          h: 'full',
          top: 0,
          left: 0,
          bg: 'linear-gradient(115deg, #5833EB 0%, transparent 100%),linear-gradient(115deg, #5833EB 0%, transparent 80%),linear-gradient(115deg, #5833EB 0%, transparent 65%)',
          animation,
        }}
      >
      </Box>
      <Box position={"absolute"}>
        <LoadingClip
          id={id}
          w={spinnerSize}
          h={spinnerSize}
          tn={spinnerThickness}
        />
      </Box>
    </Flex>
  );
}
